



let farmerslist = [];
let purchaseslist=[];
let inventory=[];
let Categories=[];
let Orders;


async function fetchData(filePath) {
    console.log("hi");
    
        const response = await fetch(filePath); 
        const data=await response.json()
        console.log(data)
        return await data;
           
   
    
}

async function loadData() {
   await fetchData("./data/farmers.json").then(data => {data.forEach(farmer=>farmerslist.push(farmer))})
   await fetchData("./data/purchases.json").then(data => {data.forEach(purchases=>purchaseslist.push(purchases))})
   await fetchData("./data/inventory.json").then(data => {data.forEach(inventoryI=>inventory.push(inventoryI))})
   await fetchData("./data/Category.json").then(data => {data.forEach(category=>Categories.push(category))})
   await fetchData("/orders.json").then(data => Orders=data)
   calculate_revenue()
}
loadData()

let TotalBlueBerries=0;
let TotalExpenses=0
let TotalRevenue=0;
function calculate_revenue(){
    TotalExpenses=calculateexpenses("AllTime");
    TotalRevenue=0;
console.log(Orders)
Orders.forEach(order=>TotalRevenue+=order.TotalPrice)
console.log(TotalRevenue)

}

// Creates a notification
function createToast(message){
    const toast = document.createElement("div");
    document.body.appendChild(toast);
    
    toast.classList.add("toastbox")
    toast.innerHTML=`
    <p>
    ${message}
    </p>
    `
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

async function saveData(filePath, data) {
    console.log(`Saving to ${filePath}:` );
    JSON.stringify(data, null, 2)
}


function updateContent(html) {
    const content = document.getElementById("content");
    content.innerHTML = html;
}

function testspecialcharss(str) {
    // Define the pattern to search for special characters
    const specialChars = /[^a-zA-Z" "]/;
    // Test the string against the pattern
    return specialChars.test(str);
}
function testID(id){
    specialChars = /[^0-9" "]/;
    return specialChars.test(id);
}

// ------------------- Farmers Management -------------------

function loadFarmers() {
    
    console.log("inload"+farmerslist)
    const html = `
        <div class="card">
            <h2>Farmers</h2>
            <ul>
                ${farmerslist.map(farmer => `<li class="farmer-box"><div><span> Farmer ID:${farmer.id} </span>
        <span> Name:${farmer.name} </span>
        <span> Contact:${farmer.contact} </span> 
        <span> Location:${farmer.location} </span>
            <button class="Edit-btn" data-id="${farmer.id}"> Edit</button>
            <button  class="Delete-btn" data-id="${farmer.id}"> Delete</button></div></li>`)}
            </ul>
            <button onclick="addFarmer()">Add Farmer</button>
            <button onclick="searchPage()">Search Farmer</button>
        </div>
    `;
    
    
    updateContent(html);
    addFarmerListeners()

}
function searchPage(){
    const html = `
        <div class="card">
            <h2>Search Farmer</h2>
            <input type="text" id="searchinput" placeholder="Search Keyword">
            
            <button onclick="searchfarmer()">Search</button>
        </div>
    `;
    updateContent(html);
}
function searchfarmer(){
    const searchvalue= document.getElementById("searchinput").value.trim().toLowerCase();
    const results=farmerslist.filter(farmer=>farmer.name.toLowerCase().includes(searchvalue)||farmer.location.toLowerCase().includes(searchvalue));
    if(results.length>0){
            html=`
            <div class="card">
                    <h2>Farmers</h2>
                    <ul>
                        ${results.map(farmer => `<li class="farmer-box"><div><span> Farmer ID:${farmer.id} </span>
                <span> Name:${farmer.name} </span>
                <span> Contact:${farmer.contact} </span> 
                <span> Location:${farmer.location} </span>
                    <button class="Edit-btn" data-id="${farmer.id}"> Edit</button>
                    <button  class="Delete-btn" data-id="${farmer.id}"> Delete</button></div></li>`)}
                    </ul>
                    
                </div>`

            updateContent(html)
            addFarmerListeners()
        }else{
            html=`
            <p>No Farmers Found</p>`
            updateContent(html)
        }
}

function addFarmer() {
    const html = `
        <div class="card">
            <h2>Add Farmer</h2>
            <input type="number" id="farmerID" placeholder="Farmer ID">
            <input type="text" id="farmerName" placeholder="Farmer Name">
            <input type="text" id="farmerContact" placeholder="Farmer Contact">
            <input type="text" id="farmerLocation" placeholder="Farmer Location">
            <button onclick="saveFarmer()">Save Farmer</button>
        </div>
    `;
    updateContent(html);
}

function saveFarmer() {


    const newid =parseInt(document.getElementById("farmerID").value.trim());
    const name = document.getElementById("farmerName").value.trim();
    const contact = document.getElementById("farmerContact").value.trim();
    const location = document.getElementById("farmerLocation").value.trim();
    if (newid===""|| name ==="" || contact===""|| location==="") {
        createToast("Not accepted values")
        return;
    }else if (testspecialcharss(name)||testID(newid)){
        createToast("The Name/ID Shouldn't contain any Special Chars")
        return;
    }else if(farmerslist.findIndex(farmersearch=>farmersearch.id===newid)!==-1){
        createToast("The Farmer Already Exists")
        return;
    };
    
    farmerslist.push({ id: newid, name, contact, location,Purchases:[] });
     console.log(farmerslist)
     createToast("farmer added")
    loadFarmers();
}
function deletefarmer(event){
    const farmerid = parseInt(event.target.getAttribute("data-id"))
    console.log("1")
    console.log(farmerid)
    farmerslist=farmerslist.filter(farmer=>farmer.id!==farmerid)
    console.log(farmerslist)
    loadFarmers();
}
function ConfirmEdit(farmer) {


    const newid =parseInt(document.getElementById("farmerID").value.trim());
    const name = document.getElementById("farmerName").value.replace(/\s+/g, ' ').trim();
    const contact = document.getElementById("farmerContact").value.trim();
    const location = document.getElementById("farmerLocation").value.trim();
    if (newid===""|| name ==="" || contact===""|| location==="") {
        createToast("Not accepted values")
        return;
    }else if (testspecialcharss(name)||testID(newid)){
        createToast("The name/Id Shouldn't contain any Special Chars")
        return;
    }else if(farmer.id!==newid &&farmerslist.findIndex(farmersearch=>farmersearch.id===newid)!==-1){
        createToast("This ID Already used")
        return;
    };
    console.log(name)
    farmer.id=newid;
    farmer.name=name;
    console.log(farmer.name)
    farmer.contact=contact;
    farmer.location=location;
    
     console.log(farmerslist)
    
    loadFarmers();
}
function editfarmer(event){
    const fid = parseInt(event.target.getAttribute("data-id"))
    const Farmer=farmerslist.find(farmer=>fid===farmer.id)
    console.log(Farmer)
    const html =`<div id="editfarmer-box">
    <input type="number" id="farmerID" placeholder="Farmer ID">
    <input type="text" id="farmerName" placeholder="Farmer Name">
    <input type="text" id="farmerContact" placeholder="Farmer Contact">
    <input type="text" id="farmerLocation" placeholder="Farmer Location">
    <button  id="confirm-Edit">Save Changes </button>
    </div>
    `;
    
    updateContent(html)
    document.getElementById("farmerID").value=fid;
    document.getElementById("farmerName").value=Farmer.name;
    document.getElementById("farmerContact").value=Farmer.contact;
    document.getElementById("farmerLocation").value=Farmer.location;
    document.getElementById("confirm-Edit").addEventListener("click",function(){ConfirmEdit(Farmer)})
    
}
function addFarmerListeners(){
    document.querySelectorAll(".Delete-btn").forEach(button => {
        console.log("added")
        button.addEventListener("click" , deletefarmer)
    })
    document.querySelectorAll(".Edit-btn").forEach(button => {
        console.log("added")
        button.addEventListener("click" , editfarmer)
    })
}

// ------------------- Purchases Management -------------------

 function loadPurchases() {
    
    const date = new Date();
const dateString = date.toISOString();
console.log(date)
    TotalExpenses=calculateexpenses("AllTime")
    const html = `
        <div class="card">
            <h2>Purchases</h2>
            <span>Sorting Options</span>
            <button onclick="sortPurchases('latest')"> Latest First</button>
            <button onclick="sortPurchases('earliest')"> Earliest First</button>
            <button onclick="sortbyname()">Farmer name</button>
            <button onclick="sortbyquantity('Desc')">Quantity (High-Low)</button>
            <button onclick="sortbyquantity('Asc')">Quantity (Low-High)</button>
            <div id="PSecond-part">
            <ul>
                ${purchaseslist.map(purchase =>{let farmer=farmerslist.find(f=>f.id===purchase.farmerId) 
                    return `<li class="purchases-box"><div><span> Purchase ID:${purchase.purchaseId} </span>
        <span> Farmer ID:${purchase.farmerId} </span>
        <span> Farmer Name:${farmer.name} </span>
        <span> Date:${formatDate(purchase.date)} </span> 
        <span> Category:${purchase.category} </span> 
        <span> Quantity:${purchase.quantity} Kg </span>
        <span> pricePerKg:${purchase.pricePerKg} $/kg </span>
        <span> totalCost:${purchase.totalCost} $</span>
            `})}
            </ul>
            <button onclick="addPurchase()">Add Purchase</button>
            
            </div>
            <div id="PThird-part">
            <h3>Total Expenses</h3>
            <span> :${TotalExpenses} $</span>
            </div>
        </div>
    `;
    console.log(purchaseslist)
    console.log("hi")
    updateContent(html);
    console.log("hi")
    
}
function sortPurchases(order){
    const sortedlist=purchaseslist;
    const listingDiv=document.getElementById("PSecond-part")
    console.log("hi")
    listingDiv.innerHTML = ``;
    if( order==="latest"){
        console.log(order)
        sortedlist.sort((a,b)=>new Date(a.date)-new Date(b.date))

    }else {
        console.log(order)
        sortedlist.sort((a,b)=>new Date(b.date)-new Date(a.date))
    }
    listingDiv.innerHTML = `
            <ul>
                ${sortedlist.map(purchase =>{let farmer=farmerslist.find(f=>f.id===purchase.farmerId) 
                    return `<li class="purchases-box"><div><span> Purchase ID:${purchase.purchaseId} </span>
        <span> Farmer ID:${purchase.farmerId} </span>
        <span> Farmer Name:${farmer.name} </span>
        <span> Date:${formatDate(purchase.date)} </span>
        <span> Category:${purchase.category} </span>  
        <span> Quantity:${purchase.quantity} Kg </span>
        <span> pricePerKg:${purchase.pricePerKg} $/kg </span>
        <span> totalCost:${purchase.totalCost} $</span>
            `})}
            </ul>
            
    `;
 
}
function sortbyname(){
    const listingDiv=document.getElementById("PSecond-part")
    listingDiv.innerHTML=`<input type="text" id="purchaseFarmerName" placeholder="Farmer Name">
    <button onclick="sortbyfarmer()">sort</button>`
}
function sortbyfarmer(){
    const listingDiv=document.getElementById("PSecond-part")
    const farmername=document.getElementById("purchaseFarmerName").value.trim().toLowerCase();
    if(farmername===""){
        createToast("Not avaliabe Value")
        return
    }
    const simillernames=farmerslist.filter(farmer=>farmer.name.toLowerCase().includes(farmername)); //all the farmers with the searched names
    let resultpurchases=[]
    for(j in simillernames){
        for( i in purchaseslist){
            console.log(i)
            if (farmerslist[j].id===purchaseslist[i].farmerId){
                resultpurchases.push(purchaseslist[i])
            }
        }
    }
    
    listingDiv.innerHTML = `
    <ul>
        ${resultpurchases.map(purchase =>{let farmer=farmerslist.find(f=>f.id===purchase.farmerId)
            return `<li class="purchases-box"><div><span> Purchase ID:${purchase.purchaseId} </span>
<span> Farmer ID:${purchase.farmerId} </span>
<span> Farmer Name:${farmer.name} </span>
<span> Date:${purchase.date} </span> 
<span> Quantity:${purchase.quantity} Kg </span>
<span> pricePerKg:${purchase.pricePerKg} $/kg </span>
<span> totalCost:${purchase.totalCost} $</span>
    `})}
    </ul>
    
`;  
}
function sortbyquantity(order){
    const listingDiv=document.getElementById("PSecond-part");
    const sortedlist=purchaseslist;
    listingDiv.innerHTML = ``;
    
    if(order==="Desc"){
        console.log(order)
        sortedlist.sort((a,b)=>b.quantity-a.quantity)
    }else{
        console.log(order)
        sortedlist.sort((a,b)=>a.quantity-b.quantity)
    }
    listingDiv.innerHTML = `
            <ul>
                ${sortedlist.map(purchase =>{let farmer=farmerslist.find(f=>f.id===purchase.farmerId) 
                    return `<li class="purchases-box"><div><span> Purchase ID:${purchase.purchaseId} </span>
        <span> Farmer ID:${purchase.farmerId} </span>
        <span> Farmer Name:${farmer.name} </span>
        <span> Date:${purchase.date} </span> 
        <span> Quantity:${purchase.quantity} Kg </span>
        <span> pricePerKg:${purchase.pricePerKg} $/kg </span>
        <span> totalCost:${purchase.totalCost} $</span>
            `})}
            </ul>
            
    `;
}

function addPurchase() {
    const html = `
        <div class="card">
            <h2>Add Purchase</h2>
            <input type="number" id="purchaseFarmerID" placeholder="Farmer ID">

            <select>
                <option value="Frozen">Frozen</option>
                <option value="Organic">Organic</option>
                <option value="Fresh">Fresh</option>
                
                </select>
            <input type="number" id="purchaseQuantity" placeholder="Quantity ( in kg)">
            <input type="number" id="purchasePricePerKg" placeholder="Price per kg">
            
            <button onclick="savePurchase()">Save</button>
        </div>
    `;
    updateContent(html);
}
function formatDate(date){
    const isodate= new Date(date)
    let Day= isodate.getDate();
    let Month=isodate.getMonth()+1;
    const year=isodate.getFullYear();
    Day= Day <10 ? "0"+Day :Day
    Month= Month <10 ? "0"+Month :Month
   
    return(`${Day}-${Month}-${year}`)
    
}

function savePurchase() {
    const farmerId = parseInt(document.getElementById("purchaseFarmerID").value);
    const category = document.querySelector("select").value;
    const quantity = parseInt(document.getElementById("purchaseQuantity").value);
    const pricePerKg = parseFloat(document.getElementById("purchasePricePerKg").value);
    const date=new Date()
    console.log(date)
    const totalCost = quantity * pricePerKg;
    if(farmerId===""|| quantity ==="" || pricePerKg===""||date==""){
        createToast("Please fill all the boxes")
        return
    }else if(testID(farmerId)|| testID(quantity)||testID(pricePerKg)){
        createToast("only number accepted");
        return;
    }else if (farmerslist.findIndex(farmersearch=>farmersearch.id===farmerId)===-1){
        createToast("This Farmer Does not Exist")
        return
    }
    const purchaseId= purchaseslist.length +1001
    const farmer=farmerslist.find(farmer=>farmer.id===farmerId);
    inventory.find(item=>item.category===category).stock +=quantity
    purchaseslist.push({purchaseId , farmerId,date,category,quantity,pricePerKg,totalCost})
    farmer.Purchases.push(purchaseId)
    loadPurchases(purchaseslist);
}
function calculateexpenses(timeperiod){
    const enddate=new Date();
    let totalExpenses=0;
    if(timeperiod==="AllTime"){
        purchaseslist.forEach(p=>totalExpenses=totalExpenses+p.totalCost)
        return totalExpenses
    }
    console.log(totalExpenses)
    
}

// ------------------- Product Categorization -------------------
function loadPacking() {
    
    
    const html = `
        <div class="card">
            <h2>Categories</h2>
            <ul>
                ${Categories.map(category => `<li class="category-box" data-id="${category.id}"><div><span> Category ID:${category.id} </span>
            <span> Name:${category.name} </span>
            <span> Weight:${category.weight} </span> 
            <span> PricePerUnit:${category.pricePerUnit} </span>
            <span> Stock:${category.stock} </span>
            <button class="Edit-btn-category" data-id="${category.id}"> Edit</button>
            <button class="add-btn-category" data-id="${category.id}"> Add Packs</button>`).join(" ")}

            </ul>
            <button onclick="createCategory()">Create Category</button>
        </div>
    `;
    
    
    updateContent(html);
    console.log(document.querySelectorAll("Edit-btn-category"))
    document.querySelectorAll(".Edit-btn-category").forEach(btn=>btn.addEventListener("click",editCategory))
    document.querySelectorAll(".add-btn-category").forEach(btn=>btn.addEventListener("click",addPack))

}
function editCategory(){

}
function addPack(event){
    console.log("hi")
    const id =event.target.getAttribute("data-id")
    const cateBox=document.querySelector(`.category-box[data-id="${id}"]`)
    const input=document.createElement("div");
input.innerHTML=`<input type="number" id="addingAmount" placeholder="Amount of Units"> 
<button id="confirm-addition-category" data-id="${id}"> Confirm</button>`
cateBox.appendChild(input)
}



function createCategory(){
    const html = `
        <div class="card">
            <h2>Create Category</h2>
            <input type="text" id="categoryName" placeholder="Category Name">
            <input type="number" id="weightCategory" placeholder="Weight ( in kg)" min="0">
            <input type="number" id="categoryPricePerUnit" placeholder="Price Per Unit">
            
            <button onclick="saveCategory()">Create</button>
        </div>
    `;
    updateContent(html);
}
function saveCategory(){
    const name = document.getElementById("categoryName").value.trim();
    const weight = parseInt(document.getElementById("weightCategory").value);
    const pricePerUnit = parseFloat(document.getElementById("categoryPricePerUnit").value);
   
    if(name===""|| weight ==="" || pricePerUnit===""){
        createToast("Please fill all the boxes")
        return
    }else if(testID(weight)||testID(pricePerUnit)){
        createToast("only Positive numbers accepted");
        return;
    }else if (testspecialcharss(name)){
        createToast("Spiecial Chars not accepted for the name");
        return;
    }else if (Categories.findIndex(cate=>cate.name.toLowerCase()===name.toLowerCase())!==-1){
        createToast("This Category name already in use")
        return
    }else if (weight===0 || pricePerUnit===0){
        createToast("The weight and price should be greater than 0")
        return
    }
    const id= Categories.length +1
    
    
    Categories.push({id , name,weight,pricePerUnit,"stock":0})
    loadPacking()
}
// ------------------- Utility Functions -------------------





function updateContent(html) {
    const content = document.getElementById("content");
    content.innerHTML = html;
}




function formatCurrency(number) {
    return `$${number.toFixed(2)}`;
}

loadFarmers();







// ------------------- Inventory Management -------------------


function loadInventory() {
    const content = document.getElementById("content");
    const lowStockItems = inventory.filter(item => item.stock < item.ReorderLevel);
    console.log(inventory)
    console.log(lowStockItems)
    const html = `
        <div class="card">
            <h2>Inventory Management</h2>
            <button id ="DemandForecast" >Demand forecast (Week)</button>
            <button onclick="generateReport()">Generate Report</button>
            <div id="ISecond-part">
            <ul>
                ${inventory.map(item => `
                    <li>
                        <span>${item.itemId}</span>
                        <span>${item.category} - ${item.stock}kg </span>
                        <span>Reorder Level: ${item.ReorderLevel}kg</span>
                        <button onclick="updateStock(${item.itemId})">Update Stock</button>
                    </li>`).join('')}
            </ul>
            </div>
            
            ${lowStockItems.length > 0 ? `
                <div class="notification">
                    <strong>Low Stock Alert!</strong>
                    ${lowStockItems.map(item => `<span>${item.category} is below reorder level!</span>`).join('<br>')}
                </div>` : ''}
        </div>
    `;
    updateContent(html)
    document.getElementById("DemandForecast").addEventListener("click",()=>{
        const weeklist=inventoryTime("week")
        demandForecast(weeklist)
    })
}


function addInventory() {
    const html = `
        <div class="card">
            <h2>Add Inventory</h2>
            <input type="text" id="inventoryCategory" placeholder="Category">
            <input type="number" id="inventoryStock" placeholder="Stock">
            <input type="number" id="inventoryPrice" placeholder="Price per unit">
            <button onclick="saveInventory()">Save Inventory</button>
        </div>
    `;
    updateContent(html);
}


async function saveInventory() {
    if (!validateFields({ inventoryCategory: "text", inventoryStock: "number", inventoryPrice: "number" })) return;
    console.log("valid")
    const category = document.getElementById("inventoryCategory").value;
    const stock = parseInt(document.getElementById("inventoryStock").value);
    const pricePerUnit = parseFloat(document.getElementById("inventoryPrice").value);

    const inventory = await fetchData("./data/inventory.json");
    inventory.push({ category, stock, pricePerUnit });
    await saveData("./data/inventory.json", inventory);
    loadInventory();
}
function inventoryTime(timeperiod){//this generates a list of the purchases for time  certain period
    const todayDate =new Date();
    console.log(timeperiod)
    let filteredlist=[]
    if(timeperiod==="day"){
         filteredlist=Orders.filter(order=>{(todayDate-new Date(order.Date))/(1000*60*60*24) <=1})
    }else if (timeperiod==="week"){
        
         filteredlist=Orders.filter(order=>(todayDate-new Date(order.Date))/(1000*60*60*24) <=7)
         console.log(filteredlist)
    }else if(timeperiod==="month"){
         filteredlist=Orders.filter(order=>{todayDate.getFullYear()===new Date(order.Date).getFullYear() && todayDate.getMonth()===new Date(order.Date).getMonth()})
    }else 
     filteredlist=Orders

    console.log(filteredlist)
    return filteredlist
}
function demandForecast(list){
    console.log(list)
    let demandlist={};
    console.log(list.Products)
    list.forEach(order=>order.Products.forEach(product=>{
        if(!demandlist[product.Category]){
            demandlist[product.Category]={total:0,count:0}
        }
        console.log(product.Category)
        console.log(Categories)
        console.log(Categories.find(cate=>cate.name===product.Pack))
        demandlist[product.Category].total+=Categories.find(cate=>cate.name===product.Pack).weight
        demandlist[product.Category].count+=1;
    }))
    let forecasted=[]
    Object.keys(demandlist).forEach(category=>{
        const average=demandlist[category].total/demandlist[category].count
        const prediction=Math.ceil(average*7)
        forecasted.push({category:category
            ,totalSales:demandlist[category].total
            ,prediction:prediction
        })
    })
    console.log(demandlist)
    let listingDiv=document.getElementById("ISecond-part")
    listingDiv.innerHTML=`<ul>
                ${forecasted.map(item => `
                    <li>
                        <span> Category: ${item.category}</span>
                        <span> Total Sales ${item.totalSales}</span>
                        <span>Prediction For the next Week: ${item.prediction}</span>
                    
                    </li>`).join('')}
            </ul>`
}

// ------------------- Sales Management -------------------


function loadOrders() {
    console.log(Orders)
    TotalRevenue=0
    Orders.forEach(order=>TotalRevenue+=order.TotalPrice)
    const html = `
        <div class="card">
            <h2>Orders</h2>
            <span>Sorting Options</span>
            <button onclick="sortOrder('Status')"> Status</button>
            <button onclick="sortOrder('Customer')"> Customer</button>
            <button onclick="sortOrder('Category')">Category</button>
            
            <div id="OSecond-part">
            <ul>
                ${Orders.map(order => `<li class="order-box"><span>Customer Name: ${order.CusName}</span> ${order.Products.map(product=>`<span>${product.Pack} (${product.Category}) : ${product.Quantity} units</span>`)}<span>Total Price: ${order.TotalPrice} $</span>
                    <select class="StatusSelect" data-id=${order.orderId} >
                <option value="${order.Status}">${order.Status}</option>
                <option value="Pending">Pending</option>
                <option value="Processed">Processed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                </select>
                <button class="update-status" data-id="${order.orderId}">Update</button>
                </li>`).join(" ")}
            </ul>
            <div>Total Revenue : ${TotalRevenue}</div>
            <button onclick="addSale()">Add Sale</button>
            
            </div>
        </div>
    `;
    
    
    updateContent(html);
    document.querySelectorAll(".update-status").forEach(btn=>btn.addEventListener("click",Updatestatus))
}
function sortOrder(sortingCondition){
        let listingDiv=document.getElementById("OSecond-part")
        if(sortingCondition==="Status"){
            listingDiv.innerHTML=`<select>
                <option value="Pending">Pending</option>
                <option value="Processed">Processed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                </select>
                <button onclick="sortStatus()"></button>`;
        }else if (sortingCondition==="Customer"){
            
        listingDiv.innerHTML=`<input type="text" id="CustomerName" placeholder="Cutomer Name">
        <button onclick="sortOrderByName()">sort</button>`
        }else{
            listingDiv.innerHTML=`<select>
            ${Categories.map(category=>`<option value="${category.name}"> ${category.name}</option>`)}
                </select>
                <button onclick="sortCategory()"></button>`;
        }
}
function sortOrderByName(){
    const customername=document.getElementById("CustomerName").value.trim().toLowerCase();
    const simillernames=Orders.filter(order=>order.CusName.toLowerCase().includes(customername));
    list_sorted(simillernames)
}
function sortStatus(){
    const status=document.querySelector("select").value
    const filteredList=Orders.filter(order=>order.Status===status);
    
    list_sorted(filteredList)
}
function sortCategory(){
    const category=document.querySelector("select").value
    console.log(category)
    const filteredList=[]
    for(o in Orders){
        console.log(o)
        for( p in Orders[o].Products){
            console.log(Orders[o].Products[p].category===category)
            if (Orders[o].Products[p].category===category){
                filteredList.push(Orders[o])
                break;
            }
        }
    }
    list_sorted(filteredList)
}
function list_sorted(list){
    console.log(list)
    const listingDiv=document.getElementById("OSecond-part")    
    listingDiv.innerHTML = `
    <ul>
                ${list.map(order => `<li class="order-box"><span>Customer Name: ${order.CusName}</span> ${order.Products.map(product=>`<span>${product.category} : ${product.Quantity} units</span>`)}<span>Total Price: ${order.TotalPrice} $</span>
                    <select class="StatusSelect" data-id=${order.orderId} >
                <option value="${order.Status}">${order.Status}</option>
                <option value="Pending">Pending</option>
                <option value="Processed">Processed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                </select>
                <button class="update-status" data-id="${order.orderId}">Update</button>
                </li>`)}
            </ul>
    
`; 
}
function Updatestatus(event){
    console.log(event.target)
    const id = parseInt(event.target.getAttribute("data-id"))
    console.log(id)
    
    const order=Orders.find(order=> order.orderId===id)
    console.log(order)
    order.Status=document.querySelector(`.StatusSelect[data-id="${id}"]`).value
    console.log(Orders)
    loadOrders()
    createToast("Updated Successfully")
    
}


/**
 * Render a form to add a sale.
 */
function addSale() {
    const html = `
        <div class="card">
            <h2>Add Sale</h2>
            <input type="text" id="CusName" placeholder="Customer Name">
            <input type="text" id="CusContact" placeholder="Contact Info">
            <input type="text" id="ShippingInfo" placeholder="Shipping Info">
            <div id="category-selection">
                <div class="cateBox">
                <select class="categorySelect" >
                <option value="">Select a Category</option>
                ${Categories.map(category=>`<option value="${category.name}"> ${category.name}</option>`)}
                </select>
                <input type="number" id="Quantity" placeholder="Quantity" min =1 value=1>
                </div>
                
            </div>
            <button onclick="addcategory()">Add Product</button>
            <input type="date" id="PurchaseDate" placeholder="Purchase Date">
            <button onclick="saveSale()">Save</button>
        </div>
    `;
    updateContent(html);
}
function addcategory(){
    console.log(Categories)
   
    const category_box=document.getElementById("category-selection")
    let select_box=document.createElement("div")
    select_box.classList.add("cateBox")
    console.log(Categories)
    select_box.innerHTML=`<select class="categorySelect" ><option value="">Select a Category</option>
    ${Categories.map(category=>`<option value="${category.name}" > ${category.name}</option>`)}
    </select>
    <input type="number" id="Quantity" placeholder="Quantity" min =1 value=1>`
    category_box.appendChild(select_box)
}
function saveSale() {
    const CusName = document.getElementById("CusName").value.trim();
    const CusContact = document.getElementById("CusContact").value.trim();
    const CusShippingInfo =document.getElementById("ShippingInfo").value.trim();
    let Products=[]
    const boxes=document.querySelectorAll(".cateBox")
    for (const box of boxes){
        const category =box.querySelector("select").value
        console.log(category)
        const Quantity= parseInt( box.querySelector("input").value)
        
        if(!category||!Quantity){
            
            createToast("Empty Values")
            return
            
        }else if(testID(Quantity)){
            createToast("Spiecial Chars Not Accepted for the Quantity")
            return;
        }
        else if(Quantity<1){
            createToast("The Quantity Should be Atlest 1")
            return;
        }
        else{
            console.log(Categories.find(cate=>cate.name===category))
            const TotalPrice=Categories.find(cate=>cate.name===category)["pricePerUnit"] //The Price Here is The Unit Price , not The Total Price
            const product = {
                "category": category,
                "Quantity": Quantity,
                "TotalPrice": TotalPrice
            };
            Products.push(product)
            
        }
        
    }
    console.log(Products)
    let TotalPrice=0;
    Products.forEach(cate=>TotalPrice+=cate.Quantity*cate.TotalPrice)
    if(CusName===""|| CusContact ==="" || CusShippingInfo===""){
        createToast("Please fill all the boxes")
        return
    }else if(testspecialcharss(CusName)){
        createToast("Special Chars Not accepted for the name");
        return;
    }
    const orderId= Orders.length +1
    

    Orders.push({orderId ,CusName,CusContact,CusShippingInfo,Products,TotalPrice,"Status":"Pending","Date":new Date})
    console.log(Orders)
    loadOrders();
}


//========================financialAnalysis====================
function financialAnalysis(){
    const html=`<p>Total Income : ${TotalRevenue}</p>
    <p>Total Expenses : ${TotalExpenses}</p>
    <p>Total Tax : ${TotalRevenue*0.1}</p>
    <p>Net Profit : ${TotalRevenue-TotalExpenses-TotalRevenue*0.1}</p>
    `
    updateContent(html)
}
// ------------------- Reports -------------------


async function generateReports() {
    let demandlist={};

    
    Orders.forEach(order=>order.Products.forEach(product=>{
        if(!demandlist[product.Category]){
            demandlist[product.Category]={total:0}
        }
        console.log(product.Category)
        console.log(Categories)
        console.log(Categories.find(cate=>cate.name===product.Pack))
        demandlist[product.Category].total+=Categories.find(cate=>cate.name===product.Pack).weight
        
    }))
    
    Object.keys(demandlist).forEach(category=>{})

    
    
    const Tax=TotalRevenue*0.1
    const netProfit = TotalRevenue - TotalExpenses-Tax;
    const html = `
        <div class="card">
            <h2>End-Period Report</h2>
            <p>Total Expenses: ${formatCurrency(TotalExpenses)}$</p>
            <p>Total Revenue: ${formatCurrency(TotalRevenue)}$</p>
            <p> Total Tax: ${formatCurrency(Tax)}$
            <p>Net Profit: ${formatCurrency(netProfit)}$</p>
            ${Object.keys(demandlist).map(category=>`<p> Category: ${category}  Amount: ${demandlist[category].total} Kg`)}

        </div>
    `;
    updateContent(html);
}

// ------------------- Initialization -------------------


function addNavListeners() {
    document.getElementById("manageFarmers").addEventListener("click", loadFarmers);
    document.getElementById("managePurchases").addEventListener("click", loadPurchases);
    document.getElementById("inventoryManagement").addEventListener("click", loadInventory);
    document.getElementById("catogaryPackingManagement").addEventListener("click", loadPacking)
    document.getElementById("salesManagement").addEventListener("click", loadOrders);
    document.getElementById("generateReports").addEventListener("click", generateReports);
    document.getElementById("financialAnalysis").addEventListener("click", financialAnalysis);
    

    
}

/**
 * Initialize the application.
 */
document.addEventListener("DOMContentLoaded", () => {
    addNavListeners();
});



// ------------------- Advanced Features -------------------


async function search(type, criteria, value) {
    const data = await fetchData(`./data/${type}.json`);
    const results = data.filter(item => String(item[criteria]).toLowerCase().includes(value.toLowerCase()));

    if (type === "farmers") {
        displayFarmers(results);
    } else if (type === "purchases") {
        displayPurchases(results);
    } else if (type === "sales") {
        displaySales(results);
    }
}


async function sort(type, criteria, ascending = true) {
    const data = await fetchData(`./data/${type}.json`);
    data.sort((a, b) => {
        if (a[criteria] < b[criteria]) return ascending ? -1 : 1;
        if (a[criteria] > b[criteria]) return ascending ? 1 : -1;
        return 0;
    });

    if (type === "farmers") {
        displayFarmers(data);
    } else if (type === "purchases") {
        displayPurchases(data);
    } else if (type === "sales") {
        displaySales(data);
    }
}



async function checkLowStock() {
    const inventory = await fetchData("./data/inventory.json");
    const lowStockItems = inventory.filter(item => item.stock < 50);

    if (lowStockItems.length > 0) {
        const items = lowStockItems.map(item => `${item.category} (Stock: ${item.stock})`).join("\n");
        alert(`Low Stock Alert:\n${items}`);
    }
}


function displaySales(sales) {
    const html = `
        <div class="card">
            <h2>Sales</h2>
            <ul>
                ${sales.map(s => `<li>${s.customerName} bought ${s.quantity} units of ${s.category} for ${formatCurrency(s.totalPrice)}</li>`).join('')}
            </ul>
            <button onclick="addSale()">Add Sale</button>
        </div>
    `;
    updateContent(html);
}



