export const header = [
    {
        title:"S NO",
        dataIndex:"id",
        key:'id',
        width:"10%"
    },
    {
        title:"Name",
        dataIndex:"name",
        key:"name",
        width:"20%",
        icon:"./sort.png",
        isSort:true,
        sortOrder: 'none', 
        onSort: (data, order) => {
            if (order === 'none') return [...data];
            return [...data].sort((a, b) => 
                order === 'asc' 
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name)
            );
        }
    },
    {
        title:"Email",
        dataIndex:"email",
        key:"email",
        width:"30%",
        icon:"./search.png",
        isSearch:true,
        onSearch: (item, searchTerm) => item.email.toLowerCase().includes(searchTerm.toLowerCase())
    },
    {
        title:"Gender",
        dataIndex:"gender",
        key:"gender",
        icon:"./sort.png",
         width:"20%",
        isSort:true,
        sortOrder: 'none',
        onSort: (data, order) => {
            if (order === 'none') return [...data];
            return [...data].sort((a, b) => 
                order === 'asc' 
                    ? a.gender.localeCompare(b.gender)
                    : b.gender.localeCompare(a.gender)
            );
        },
        onRender: (value) => {
            
            const img = document.createElement('img');
            img.className = "gender-icon";
            img.src = value === "Female" ? "female.png" : "male.png";
            img.alt = value;
            
            return img;
          }
    },
    {
      title:"Mob No",
      dataIndex:"mobile_number",
      key:"mobilenumber",
      width:"20%",
      icon:"./search.png",
      isSearch:true,
      onSearch: (item, searchTerm) => item.mobile_number.toLowerCase().includes(searchTerm.toLowerCase())
    }
    

]
