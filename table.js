import { header } from "./configure.js";
import {  throttle } from "./throtling.js";

let allProducts = [];
let originalProducts = [];
let searchContext = {
    field: '',
    customSearch: null
  };
let container = document.querySelector('.container');
const popup = document.getElementById("searchPopup");
const input = document.getElementById("popupSearchInput");
const searchBtn = popup.querySelector("button:nth-of-type(1)");
const closeBtn = popup.querySelector("button:nth-of-type(2)");
const resetBtn = document.getElementById('reset');

let rowHeight = 52;
let buffer = 10;
let containerHeight = 500;
let visibleCount =Math.ceil(containerHeight/rowHeight)+buffer * 2;
let tablePadding = document.querySelector('.table-padding')
const table = document.createElement('table');
table.classList.add('fade-in');

 const TableComponent = (response) =>{
    originalProducts = response;
    allProducts = response;
    tablePadding.style.height = `${allProducts.length * rowHeight}px`;
    // console.log(response,'response from table compoennt');
    
    container.innerHTML = '';
    const tableHeader = table.createTHead();
    const tableBody  = table.createTBody();
    let row = tableHeader.insertRow();
   

    header?.map((h)=>{
        let th = document.createElement("th");
        let span  = document.createElement('span');
        span.classList.add("header-title");
        span.textContent = h.title;
        th.style.width = h.width || "30%";
        
        if(h?.icon){
            let image = document.createElement('img');
            image.src= h.icon;
            image.alt=h.icon;
            image.className = "header-icon"
            image.onclick = (e) => handleClick(h,e);
            span.appendChild(image)
        }
       
        th.appendChild(span)
        row.appendChild(th)
    })
    // No Data found scenario
    if(allProducts.length == 0){
     nodatafound(tableBody)
    }
    else{
        setupVirtualScroll();
    }
    container.appendChild(table)

return table;
}


export default TableComponent;
// searchbtn function
searchBtn.addEventListener("click",() =>{
    const query = input.value.toLowerCase();
    // console.log(query,'query fom search');
    
    if(!searchContext.field) return;
    let filtered = allProducts.filter(item =>{
        if(typeof searchContext.customSearch === 'function'){
            return searchContext.customSearch(item,query)
        }
        const value = item[searchContext.field]
        // console.log(value,'value from search');
        
        return value?.toString().toLowerCase().includes(query);
    })
    renderRows(0,filtered)

popup.classList.add("displayNone");
popup.classList.remove("displayBlock");
input.value = "";
searchContext.field = '';
searchContext.customSearch = null;
});
// close button function
closeBtn.addEventListener("click", () => {
popup.classList.add("displayNone");
popup.classList.remove("displayBlock");
input.value = "";
searchContext.field = '';
searchContext.customSearch = null;
});

// render rows
const renderRows = (startIdx, data) => {
    const tableBody = table.querySelector('tbody');
    allProducts = data ? data : allProducts;
// console.log(allProducts,'allproducts from render row');

    if (allProducts.length === 0) {
        nodatafound(tableBody);
        return; 
    }

    const noDataRow = tableBody.querySelector('.no-data-row');
    if (noDataRow) {
        tableBody.removeChild(noDataRow);
    }

    const endIdx = Math.min(allProducts.length, startIdx + visibleCount);
    const rowsToRender = endIdx - startIdx;

    for (let i = 0; i < rowPool.length; i++) {
        const row = rowPool[i];
        // console.log(rowPool[i],'rowpool',endIdx,rowsToRender);
        
        if (i < rowsToRender) {
            const d = allProducts[startIdx + i];
            const cells = row.children;
            
            header.forEach((h, idx) => {
                const value = d[h.dataIndex];
                if (typeof h.onRender === "function") {
                    const customEl = h.onRender(value);
                    cells[idx].innerHTML = ''; // clear old content
                    cells[idx].appendChild(
                        customEl instanceof HTMLElement ? customEl : document.createTextNode(customEl || 'NA')
                    );
                } else {
                    cells[idx].textContent = value || 'NA';
                }
            });

            row.style.display = ''; // show row
        } else {
            row.style.display = 'none'; 
        }
    }

    const translateY = startIdx * rowHeight;
    tableBody.style.transform = `translateY(${translateY}px)`;
};
// scroll function
const onScroll = throttle(() => {
    const scrollTop = container.scrollTop;
    const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - buffer);
    renderRows(startIndex);
}, 100); 

let rowPool = []; // pool of reusable tr elements

const setupVirtualScroll = () => {
    const totalHeight = allProducts.length * rowHeight;
    tablePadding.style.height = `${totalHeight}px`;
    visibleCount = Math.ceil(container.clientHeight / rowHeight) + buffer * 2;

    const tableBody = table.querySelector('tbody');
    createPool(tableBody)
    container.addEventListener('scroll', onScroll);
    renderRows(0);
};
// no data found function
const nodatafound = (tableBody) => {
    tableBody.innerHTML=''
    let rowData = tableBody.insertRow();
    rowData.classList.add('no-data-row'); 
    let td = document.createElement('td');
    td.colSpan = header.length;
    let image = document.createElement('img');
    image.src = "./nodatafound.gif";
    image.alt = "No data found";
    image.className = "no-data";
    td.appendChild(image);
    rowData.appendChild(td);
};
// createpool
const createPool = (tableBody) =>{
    for (let i = 0; i < visibleCount; i++) {
        const row = document.createElement('tr');
        header.forEach(() => {
            const cell = document.createElement('td');
            row.appendChild(cell);
        });
        tableBody.appendChild(row);
        rowPool.push(row);
    }

}
resetBtn.addEventListener("click",()=>{
    allProducts = [...originalProducts];
    rowPool = [];
    const tableBody = table.querySelector('tbody');
    tableBody.innerHTML = '';
    tablePadding.style.height = `${allProducts.length * rowHeight}px`;
    container.removeEventListener('scroll', onScroll);

    setupVirtualScroll();
})
// handleclick function
export const handleClick = (head,event) =>{
    if (head.isSort) {
        if (head.sortOrder === 'none') {
            head.sortOrder = 'asc';
        } else if (head.sortOrder === 'asc') {
            head.sortOrder = 'desc';
        } else {
            head.sortOrder = 'none';
        }

        const sortFunction = head.onSort;
        if (head.sortOrder === 'none') {
            // console.log(originalProducts,'original');
            
            allProducts = [...originalProducts] 
        } else if (typeof sortFunction === 'function') {
            allProducts = sortFunction([...allProducts], head.sortOrder);
        }

        renderRows(0, allProducts);

        const img = event.target.tagName === 'IMG' ? event.target : event.target.querySelector('img');
        if (img) {
            if (head.sortOrder === 'asc') {
                img.src = head.sortAscIcon;
            } else if (head.sortOrder === 'desc') {
                img.src = head.sortDesIcon;
            } else {
                img.src = icon;
            }
        }
    } 
    else if(head.isSearch){
     popup.classList.remove("displayNone");
     searchContext.field = head.dataIndex;
     searchContext.customSearch = head.onSearch;
   
   
     const rect = event.target.getBoundingClientRect();
   
     popup.style.top = `${(rect.bottom+ window.scrollY)+10 }px`;
     popup.style.left = `${(rect.left + window.scrollX)-250}px`;
   
     input.value = ""; 
    
     popup.classList.add("displayBlock");
    } 
}