import { header } from "./configure.js";
import { setResizeListeners, throttle } from "./throtling.js";

let sortAscending = true;
let allProducts = [];
let searchContext = {
    field: '',
    customSearch: null
  };
let container = document.querySelector('.container');
const popup = document.getElementById("searchPopup");
const input = document.getElementById("popupSearchInput");
const searchBtn = popup.querySelector("button:nth-of-type(1)");
const closeBtn = popup.querySelector("button:nth-of-type(2)");
export const handleClick = (head,event) =>{
    if(head.isSort){
        const {onSort} = head;
        sortAscending = !sortAscending;
        // console.log(onSort,'onSort',sortAscending);
        allProducts.sort((a,b) => onSort(a,b,sortAscending));
        renderRows(0,allProducts);
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
let rowHeight = 52;
let buffer = 10;
let containerHeight = 500;
let visibleCount =Math.ceil(containerHeight/rowHeight)+buffer * 2;
// let virtualTable =  document.querySelector(".virtual-table");
let tablePadding = document.querySelector('.table-padding')
let startIndex = 0
const table = document.createElement('table');
table.classList.add('fade-in');
 const TableComponent = (response) =>{
    allProducts = response;
    tablePadding.style.height = `${allProducts.length * rowHeight}px`;
    console.log(response,'response from table compoennt');
    
    container.innerHTML = '';
    // table.classList.add('virtual-table');
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
        const resizer = document.createElement("div");
        resizer.className = "resizer";
        th.appendChild(resizer);
        setResizeListeners(th, resizer);
        row.appendChild(th)
    })
    // No Data found scenario
    if(allProducts.length == 0){
      let rowData = tableBody.insertRow();
      let td = document.createElement('td');
       td.colSpan = header.length;
      let image = document.createElement('img');
      image.src = "./nodatafound.gif";
      image.alt="nodatafound";
      image.className ="no-data"
      td.appendChild(image)
      rowData.appendChild(td);
    }
    else{
        setupVirtualScroll();
    }
    container.appendChild(table)

return table;
}


export default TableComponent;

searchBtn.addEventListener("click",() =>{
    const query = input.value.toLowerCase();
    console.log(query,'query fom search');
    
    if(!searchContext.field) return;
    let filtered = allProducts.filter(item =>{
        if(typeof searchContext.customSearch === 'function'){
            return searchContext.customSearch(item,query)
        }
        const value = item[searchContext.field]
        console.log(value,'value from search');
        
        return value?.toString().toLowerCase().includes(query);
    })
    renderRows(0,filtered)
// Close modal
popup.classList.add("displayNone");
popup.classList.remove("displayBlock");
input.value = "";
searchContext.field = '';
searchContext.customSearch = null;
});

closeBtn.addEventListener("click", () => {
popup.classList.add("displayNone");
popup.classList.remove("displayBlock");
input.value = "";
searchContext.field = '';
searchContext.customSearch = null;
});

const renderRows = (startIdx, data) => {
    let tableBody = document.createElement('tbody');
    const oldBody = table.querySelector('tbody');
    if (oldBody) oldBody.remove();

    allProducts = data ? data : allProducts;

    const endIdx = Math.min(allProducts.length, startIdx + visibleCount);
    const fragment = document.createDocumentFragment();

    if (allProducts.length === 0) {
        let rowData = tableBody.insertRow();
        let td = document.createElement('td');
        td.colSpan = header.length;
        let image = document.createElement('img');
        image.src = "./nodatafound.gif";
        image.alt = "nodatafound";
        image.className = "no-data";
        td.appendChild(image);
        rowData.appendChild(td);
    } else {
        // 👇 Add the padding row to simulate vertical offset
        const paddingRow = document.createElement('tr');
        paddingRow.style.height = `${startIdx * rowHeight}px`;
        paddingRow.style.pointerEvents = "none";
        paddingRow.style.visbility = "hidden";

        let td = document.createElement('td');
        td.colSpan = header.length;
        paddingRow.appendChild(td);
        tableBody.appendChild(paddingRow); // 👈 Append padding row first

        // 👇 Now add visible rows
        for (let i = startIdx; i < endIdx; i++) {
            const d = allProducts[i];
            let rowData = document.createElement('tr');

            header.forEach((h) => {
                let cell = document.createElement('td');
                const value = d[h.dataIndex];
                if (typeof h.onRender === "function") {
                    const customEl = h.onRender(value);
                    cell.appendChild(
                        customEl instanceof HTMLElement ? customEl : document.createTextNode(customEl || 'NA')
                    );
                } else {
                    cell.textContent = value || 'NA';
                }
                rowData.appendChild(cell);
            });

            fragment.appendChild(rowData);
        }

        tableBody.appendChild(fragment); // 👈 Append data rows after padding
    }

    table.appendChild(tableBody);
};

const onScroll = throttle(() => {
    const scrollTop = container.scrollTop;
    const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - buffer);
    renderRows(startIndex);
}, 100); 

const setupVirtualScroll = () => {
    const totalHeight = allProducts.length * rowHeight;
    tablePadding.style.height = `${totalHeight}px`;

    container.addEventListener('scroll',onScroll)

    renderRows(0);
};
