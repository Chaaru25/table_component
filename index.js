
import TableComponent from "./table.js";
import { getData } from "./api.js";

let container = document.querySelector('.container');
// document.addEventListener('DOMContentLoaded',async() =>{
  let data = await getData();
  console.log(data,'data');
  
  TableComponent(data);
// })

