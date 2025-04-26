export async function getData() {
    const url = "./data.json"
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      // console.log(json);
      return json;
    } catch (error) {
      console.error(error.message);
      throw ErrorEvent;
    }
  }
  