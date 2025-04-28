
import TableComponent from "./table.js";
import { getData } from "./api.js";

let container = document.querySelector('.container');
  let data = await getData();
  console.log(data,'data');
  
  TableComponent(data);


