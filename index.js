
import TableComponent from "./table.js";
import { getData } from "./api.js";

  let data = await getData();
  TableComponent(data);


