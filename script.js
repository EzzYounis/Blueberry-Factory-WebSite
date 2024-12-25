



let farmerslist = [];
let purchaseslist=[];
let inventory=[];
let Categories=[];
let Orders=[];
let PackInventory=[];

async function fetchData(filePath) {    
        const response = await fetch(filePath); 
        const data=await response.json()
        return await data;
}

function saveToLocalstorage(){
    localStorage.setItem("farmerlist",JSON.stringify(farmerslist));
    localStorage.setItem("purchaseslist",JSON.stringify(purchaseslist));
    localStorage.setItem("inventory",JSON.stringify(inventory));
    localStorage.setItem("Categories",JSON.stringify(Categories));
    localStorage.setItem("Orders",JSON.stringify(Orders));
    localStorage.setItem("PackInventory",JSON.stringify(PackInventory));
}
function loadFromLocalStorage(){
    farmerslist=JSON.parse(localStorage.getItem("farmerlist"))||[];
    purchaseslist=JSON.parse(localStorage.getItem("purchaseslist"))||[];
    inventory=JSON.parse(localStorage.getItem("inventory"))||[];
    Categories=JSON.parse(localStorage.getItem("Categories"))||[];
    Orders=JSON.parse(localStorage.getItem("Orders"))||[];
    PackInventory=JSON.parse(localStorage.getItem("PackInventory"))||[];
}
async function updateStorage(){
     
    saveToLocalstorage()
    loadFromLocalStorage()
}

async function loadData() {
    await fetchData("/orders.json").then(data =>  {data.forEach(order=>Orders.push(order))})
   await fetchData("./data/packsInventory.json").then(data =>  {data.forEach(pi=>PackInventory.push(pi))})
   await fetchData("./data/farmers.json").then(data =>  {data.forEach(farmer=>farmerslist.push(farmer))})
   await fetchData("./data/purchases.json").then(data =>  {data.forEach(purchases=>purchaseslist.push(purchases))})
   await fetchData("./data/inventory.json").then(data => {data.forEach(inventoryI=>inventory.push(inventoryI))})
   await fetchData("./data/Category.json").then(data => {data.forEach(category=>Categories.push(category))})
   
   calculate_revenue()
}
const listsnames=["farmerlist","purchaseslist","inventory","Categories","Orders","PackInventory"]
function isdataloaded(list){
    for (const data of list){
        let datakey=localStorage.getItem(data)
        if (datakey===null){
            return false
        }
    }
    return true;
}

async function dataloadtest(){
    if(!isdataloaded(listsnames)){
         await loadData()
        saveToLocalstorage()
    }else{
        loadFromLocalStorage()
    }
}
dataloadtest()


let TotalBlueBerries=0;
let TotalExpenses=calculateexpenses("AllTime");
let TotalRevenue=0;


TotalRevenue=calculate_revenue("AllTime")

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




function updateContent(html) {
    const content = document.getElementById("content");
    content.innerHTML = html;
}

function testspecialcharss(str) {
    const specialChars = /[^a-zA-Z" "]/;
    return specialChars.test(str);
}
function testID(id){
    specialChars = /[^0-9" "]/;
    return specialChars.test(id);
}

// ------------------- Farmers Management -------------------

function loadFarmers() {
    
    const html = `
        <div class="card">
            <h2>Farmers</h2>
            <ul>
                ${farmerslist.map(farmer => `<li class="farmer-box"><div><span> Farmer ID:${farmer.id} </span>
        <span> Name:${farmer.name} </span>
        <span> Contact:${farmer.contact} </span> 
        <span> Location:${farmer.location} </span>
        <span> Number of purchases:${farmer.Purchases.length} </span>
            <button class="Edit-btn" data-id="${farmer.id}"> Edit</button>
            <button  class="Delete-btn" data-id="${farmer.id}"> Delete</button></div></li>`).join("")}
            </ul>
            <button onclick="addFarmer()">Add Farmer</button>
            <button onclick="searchPage()">Search Farmer</button>
            <button onclick="exportFarmers()">Export Farmers</button>
        </div>
    `;
    
    
    updateContent(html);
    addFarmerListeners()

}

function exportFarmers() {
    if (farmerslist.length === 0) {
        createToast("No Farmers to export")
        return;
    }
    const csvContent = "data:text/csv;charset=utf-8,"
        + "Farmer ID,Name,Contact,Location,Purchases\n"
        + farmerslist.map(farmer => `${farmer.id},${farmer.name},${farmer.contact},${farmer.location},${farmer.Purchases}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "farmers_data.csv");
    document.body.appendChild(link);
    link.click();
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
                    <button  class="Delete-btn" data-id="${farmer.id}"> Delete</button></div></li>`).join("")}
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
        <div class ="add-edit-box">
            <h2>Add Farmer</h2>
            <input type="number" id="farmerID" placeholder="Farmer ID">
            <input type="text" id="farmerName" placeholder="Farmer Name">
            <input type="text" id="farmerContact" placeholder="Farmer Contact">
            <input type="text" id="farmerLocation" placeholder="Farmer Location">
            <button onclick="saveFarmer()">Save Farmer</button>
            </div>
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
     createToast("farmer added")
     updateStorage()
    loadFarmers();
}
function deletefarmer(event){
    const farmerid = parseInt(event.target.getAttribute("data-id"))
    farmerslist=farmerslist.filter(farmer=>farmer.id!==farmerid)
    updateStorage();
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
    purchaseslist.filter(Purchases=>Purchases.farmerId===farmer.id).forEach(purchase=> {purchase.farmerId=newid; purchase.farmername=name})
    farmer.id=newid;
    farmer.name=name;
    farmer.contact=contact;
    farmer.location=location;
    
    updateStorage()
    loadFarmers();
}
function editfarmer(event){
    const fid = parseInt(event.target.getAttribute("data-id"))
    const Farmer=farmerslist.find(farmer=>fid===farmer.id)
    const html =`<div class ="add-edit-box">
    <h2>Edit Farmer Info</h2>
    <input type="number" id="farmerID" placeholder="Farmer Id">
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
        button.addEventListener("click" , deletefarmer)
    })
    document.querySelectorAll(".Edit-btn").forEach(button => {
        button.addEventListener("click" , editfarmer)
    })
}

// ------------------- Purchases Management -------------------

 function loadPurchases() {
    
    const date = new Date();
const dateString = date.toISOString();
    TotalExpenses=calculateexpenses("AllTime")
    const html = `
        <div class="card">
            <h2>Purchases</h2>
            <span>Sorting Options</span>
            <button onclick="sortPurchases('latest')"> Latest First</button>
            <button onclick="sortPurchases('earliest')"> Oldest First</button>
            <button onclick="sortbyquantity('Desc')">Quantity (High-Low)</button>
            <button onclick="sortbyquantity('Asc')">Quantity (Low-High)</button>
            <button onclick="sortbyname()">Farmer name</button>
            <button onclick="sortbytimebox()">Time Period</button>
            <button onclick="purchaseExpenses()">Expenses</button>
            <div id="PSecond-part">
            <ul>
                ${purchaseslist.map(purchase =>
                    `<li class="purchases-box"><div><span> Purchase ID:${purchase.purchaseId} </span>
        <span> Farmer ID:${purchase.farmerId} </span>
        <span> Farmer Name:${purchase.farmername} </span>
        <span> Date:${formatDate(purchase.date)} </span> 
        <span> Category:${purchase.category} </span> 
        <span> Quantity:${purchase.quantity} Kg </span>
        <span> pricePerKg:${purchase.pricePerKg} $/kg </span>
        <span> totalCost:${purchase.totalCost} $</span>
            `).join("")}
            </ul>
            <button onclick="addPurchase()">Add Purchase</button>
            <h3>Total Expenses</h3>
            <span> :${TotalExpenses} $</span>
            </div>
            
        </div>
    `;
    updateContent(html);
    
}
function purchaseExpenses(){
    const seconbox=document.getElementById("PSecond-part")
    seconbox.innerHTML=`<select>
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
                </select>
                <button onclick="purchaseExpensescalculate()"> Show</button>`
}
function purchaseExpensescalculate(){
    const time=document.querySelector("select").value
    const todayDate=new Date()
    let filteredlist=[]
    if(time==="day"){
         filteredlist=purchaseslist.filter(purchase=>{(todayDate-new Date(purchase.date))/(1000*60*60*24) <=1})
    }else if (time==="week"){
        
         filteredlist=purchaseslist.filter(purchase=>(todayDate-new Date(purchase.date))/(1000*60*60*24) <=7)
    }else if(time==="month"){
       
        filteredlist=purchaseslist.filter(purchase=>todayDate.getFullYear()===new Date(purchase.date).getFullYear() && todayDate.getMonth()===new Date(purchase.date).getMonth())
            

    }
    let timeExpenses=0
    filteredlist.forEach(purchase=>timeExpenses+=purchase.totalCost)
    const seconbox=document.getElementById("PSecond-part")
    seconbox.innerHTML=`<h2>Total Expenses For Last ${time}</h2>
    <span>${timeExpenses}$</span>`


}

function sortbytimebox(){
    
    const listingDiv=document.getElementById("PSecond-part")
    listingDiv.innerHTML=`<input type="date" id="startDate" placeholder="Start Date"></input>
    <input type="date" id="endDate" placeholder="End Date"></input>
    <button onclick="sortbytime()">sort</button>`
}
function sortbytime(){
    const listingDiv=document.getElementById("PSecond-part")
    const startDate=new Date(document.getElementById("startDate").value)
    const endDate=new Date(document.getElementById("endDate").value)
    
    if(startDate>endDate||!startDate||!endDate){
        createToast("unacceptable Time Period")
        return
    }
    const filteredList=purchaseslist.filter(purchase=>startDate<=new Date(purchase.date)&& new Date(purchase.date)<=endDate)
    
    let timeperiodExpenses=0
    filteredList.forEach(purchase=>timeperiodExpenses+=purchase.totalCost)
    listingDiv.innerHTML = `<ul>
        ${filteredList.map(purchase =>
            `<li class="purchases-box"><div><span> Purchase ID:${purchase.purchaseId} </span>
<span> Farmer ID:${purchase.farmerId} </span>
<span> Farmer Name:${purchase.farmername} </span>
<span> Date:${formatDate(purchase.date)} </span> 
<span> Quantity:${purchase.quantity} Kg </span>
<span> pricePerKg:${purchase.pricePerKg} $/kg </span>
<span> totalCost:${purchase.totalCost} $</span>

    `).join("")}
    <h3>Time Period Expenses</h3>
            <span> :${timeperiodExpenses} $</span>
    </ul>
`; 

}
function sortPurchases(order){
    const sortedlist=purchaseslist;
    const listingDiv=document.getElementById("PSecond-part")
    listingDiv.innerHTML = ``;
    if( order==="latest"){
        sortedlist.sort((a,b)=>new Date(b.date)-new Date(a.date))

    }else {
        sortedlist.sort((a,b)=>new Date(a.date)-new Date(b.date))
    }
    listingDiv.innerHTML = `
            <ul>
                ${sortedlist.map(purchase => 
                     `<li class="purchases-box"><div><span> Purchase ID:${purchase.purchaseId} </span>
        <span> Farmer ID:${purchase.farmerId} </span>
        <span> Farmer Name:${purchase.farmername} </span>
        <span> Date:${formatDate(purchase.date)} </span>
        <span> Category:${purchase.category} </span>  
        <span> Quantity:${purchase.quantity} Kg </span>
        <span> pricePerKg:${purchase.pricePerKg} $/kg </span>
        <span> totalCost:${purchase.totalCost} $</span>
            `).join("")}
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
            if (farmerslist[j].id===purchaseslist[i].farmerId){
                resultpurchases.push(purchaseslist[i])
            }
        }
    }
    
    listingDiv.innerHTML = `
    <ul>
        ${resultpurchases.map(purchase =>
             `<li class="purchases-box"><div><span> Purchase ID:${purchase.purchaseId} </span>
<span> Farmer ID:${purchase.farmerId} </span>
<span> Farmer Name:${purchase.farmername} </span>
<span> Date:${purchase.date} </span> 
<span> Quantity:${purchase.quantity} Kg </span>
<span> pricePerKg:${purchase.pricePerKg} $/kg </span>
<span> totalCost:${purchase.totalCost} $</span>
    `).join("")}
    </ul>
    
`;  
}
function sortbyquantity(order){
    const listingDiv=document.getElementById("PSecond-part");
    const sortedlist=purchaseslist;
    listingDiv.innerHTML = ``;
    
    if(order==="Desc"){
        sortedlist.sort((a,b)=>b.quantity-a.quantity)
    }else{
        sortedlist.sort((a,b)=>a.quantity-b.quantity)
    }
    listingDiv.innerHTML = `
            <ul>
                ${sortedlist.map(purchase =>`<li class="purchases-box"><div><span> Purchase ID:${purchase.purchaseId} </span>
        <span> Farmer ID:${purchase.farmerId} </span>
        <span> Farmer Name:${purchase.farmername} </span>
        <span> Date:${purchase.date} </span> 
        <span> Quantity:${purchase.quantity} Kg </span>
        <span> pricePerKg:${purchase.pricePerKg} $/kg </span>
        <span> totalCost:${purchase.totalCost} $</span>
            `).join("")}
            </ul>
            
    `;
}

function addPurchase() {
    const html = `
        <div class="card">
        <div class ="add-edit-box"
            <h2>Add Purchase</h2>
            
            <select id="purchaseFarmerID">
                <option value="">SelectFarmer</option>
                ${farmerslist.map(farmer=>`<option value="${farmer.id}">${farmer.name}</option>`).join("")}
                
                </select>
            

            <select id="categoryselect">
                <option value="Frozen">Frozen</option>
                <option value="Organic">Organic</option>
                <option value="Fresh">Fresh</option>
                
                </select>
            <input type="number" id="purchaseQuantity" placeholder="Quantity ( in kg)">
            <input type="number" id="purchasePricePerKg" placeholder="Price per kg">
            
            <button onclick="savePurchase()">Save</button>
            </box>
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
    let farmerId = document.getElementById("purchaseFarmerID").value;
    const category = document.getElementById("categoryselect").value;
    let quantity = document.getElementById("purchaseQuantity").value;
    let pricePerKg = document.getElementById("purchasePricePerKg").value;
    const date=new Date()
    
    const totalCost = quantity * pricePerKg;
    if(farmerId===""|| quantity ==="" || pricePerKg===""||date==""){
        createToast("Please fill all the boxes")
        return
    }else if ( testID(quantity)||testID(pricePerKg)){
        createToast("only number accepted");
        return;

    }else if(quantity <=0||pricePerKg<=0){
        createToast("The quantity and the price must be greater than 0");
        return;
    }
    farmerId=parseInt(farmerId)
    quantity = parseInt(quantity)
    pricePerKg = parseFloat(pricePerKg)  
    const purchaseId= purchaseslist.length +1001
    const farmer=farmerslist.find(farmer=>farmer.id===farmerId);
    inventory.find(item=>item.category===category).stock +=quantity
    purchaseslist.push({purchaseId , farmerId,farmername:farmer.name,date,category,quantity,pricePerKg,totalCost})
    farmer.Purchases.push(purchaseId)
    loadPurchases(purchaseslist);
    updateStorage()
    
}
function calculateexpenses(timeperiod){
    const todayDate=new Date();
    let totalExpenses=0;
    let filteredlist;
    if(timeperiod==="AllTime"){
        purchaseslist.forEach(p=>totalExpenses=totalExpenses+p.totalCost)
        return totalExpenses
    }else if (timeperiod==="month"){
        filteredlist=purchaseslist.filter(purchase=>todayDate.getFullYear()===new Date(purchase.date).getFullYear() && todayDate.getMonth()===new Date(purchase.date).getMonth())
        filteredlist.forEach(p=>totalExpenses=totalExpenses+p.totalCost)
        return totalExpenses
    }else if (timeperiod==="threemonth"){
        filteredlist=purchaseslist.filter(purchase=>todayDate.getFullYear()===new Date(purchase.date).getFullYear() && (todayDate.getMonth()-new Date(purchase.date).getMonth()<=3))
        filteredlist.forEach(p=>totalExpenses=totalExpenses+p.totalCost)

        return totalExpenses
    }else if (timeperiod==="sixmonth"){
        filteredlist=purchaseslist.filter(purchase=>todayDate.getFullYear()===new Date(purchase.date).getFullYear() && (todayDate.getMonth()-new Date(purchase.date).getMonth()<=6))
        filteredlist.forEach(p=>totalExpenses=totalExpenses+p.totalCost)
        return totalExpenses
    }
    
}
function calculate_revenue(timeperiod){
    const todayDate=new Date();
    let totalRevenue=0;
    let filteredlist;
    if(timeperiod==="AllTime"){
        Orders.forEach(order=>totalRevenue+=order.TotalPrice)
        return totalRevenue
    }else if (timeperiod==="month"){
        
        filteredlist=Orders.filter(order=>todayDate.getFullYear()===new Date(order.Date).getFullYear() && todayDate.getMonth()===new Date(order.Date).getMonth())
        
        filteredlist.forEach(o=>totalRevenue=totalRevenue+o.TotalPrice)
        return totalRevenue
    }else if (timeperiod==="threemonth"){
        
        filteredlist=Orders.filter(order=>todayDate.getFullYear()===new Date(order.Date).getFullYear() && (todayDate.getMonth()-new Date(order.Date).getMonth()<=3))
        filteredlist.forEach(o=>totalRevenue=totalRevenue+o.TotalPrice)
        return totalRevenue
    }else if (timeperiod==="sixmonth"){
        filteredlist=Orders.filter(order=>todayDate.getFullYear()===new Date(order.Date).getFullYear() && (todayDate.getMonth()-new Date(order.Date).getMonth()<=6))
        filteredlist.forEach(o=>totalRevenue=totalRevenue+o.TotalPrice)
        return totalRevenue
        
    }
    
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
            
            <button class="Edit-btn-category" data-id="${category.id}"> Edit</button>
            <button class="More-btn-category" data-id="${category.id}"> More.</button>
            `).join("")}

            </ul>
            <button onclick="createCategory()">Create Category</button>
        </div>
    `;
    
    
    updateContent(html);
    document.querySelectorAll(".Edit-btn-category").forEach(btn=>btn.addEventListener("click",editCategory))
    document.querySelectorAll(".More-btn-category").forEach(btn=>btn.addEventListener("click",moreCategory))
    

}
function moreCategory(event){
    const id =parseInt(event.target.getAttribute("data-id"))
    const cateBox=document.querySelector(`.category-box[data-id="${id}"]`)
    if(document.querySelector(`.category-box[data-id="${id}"] .more`)){
        return
    }
    const moreBox=document.createElement("div");
    moreBox.classList.add("more")
    moreBox.innerHTML=`
    ${PackInventory.filter(inv=>inv.packId===id).map(pack=>`<div>Category: ${inventory.find(inv=>inv.itemId===pack.itemId).category} Stock : ${pack.stock}<button class="add-btn-category" data-id="${pack.IPID}"> Add Packs</button></div>`).join("")}`
    cateBox.appendChild(moreBox)
    document.querySelectorAll(".add-btn-category").forEach(btn=>btn.addEventListener("click",addPack))
}
function editCategory(event){
    const PackId = parseInt(event.target.getAttribute("data-id"))
    const Pack=Categories.find(pack=>PackId===pack.id)
    const html =`<div id="editPack-box" class ="add-edit-box">
    <input type="number" id="price" placeholder="Price">
    <input type="text" id="name" placeholder="Name">
    <input type="number" id="weight" placeholder="Weight">
    <button  id="confirm-Edit">Save Changes </button>
    </div>
    `;
    updateContent(html);
    document.getElementById("price").value=Pack.pricePerUnit;
    document.getElementById("name").value=Pack.name;
    document.getElementById("weight").value=Pack.weight
    document.getElementById("confirm-Edit").addEventListener("click",function(){ConfirmEditPack(Pack)})
}

function ConfirmEditPack(Pack){
    const name = document.getElementById("name").value.trim();
    const weight = parseFloat(document.getElementById("weight").value);
    const pricePerUnit = parseFloat(document.getElementById("price").value);
   
    if(name===""|| weight ==="" || pricePerUnit===""){
        createToast("Please fill all the boxes")
        return
    }else if(testprice(weight)||testprice(pricePerUnit)){
        createToast("only Positive numbers accepted");
        return;
    }else if (testspecialcharss(name)){
        createToast("Spiecial Chars not accepted for the name");
        return;
    }else if (Pack.name!==name && Categories.findIndex(cate=>cate.name.toLowerCase()===name.toLowerCase())!==-1){
        createToast("This Category name already in use")
        return
    }else if (weight===0 || pricePerUnit===0){
        createToast("The weight and price should be greater than 0")
        return
    }
    Pack.name=name;
    Pack.pricePerUnit=pricePerUnit
    Pack.weight=weight;
    updateStorage()
    loadPacking()
}

function testprice(price){
    specialChars = /[^0-9." "]/;
    return specialChars.test(price);
}
function addPack(event){
    const ipid =parseInt(event.target.getAttribute("data-id"))
    const id= PackInventory.find(pack=>pack.IPID===ipid).packId
    const cateBox=document.querySelector(`.category-box[data-id="${id}"]`)
    if(document.querySelector(`.addition-box[data-id="${ipid}"]`)){
        return
    }
    const input=document.createElement("div");
    

    input.innerHTML=`<input type="number" id="addingAmount" class="addition-box" data-id=${ipid} placeholder="Amount of Units"> 
    <button class="confirm-addition-category" data-id="${ipid}"> Confirm</button>`
    cateBox.appendChild(input)
    document.querySelectorAll(".confirm-addition-category").forEach(btn=>btn.addEventListener("click",confirmAddition))
}



function createCategory(){
    const html = `
        <div class="card">
            <div class ="add-edit-box">
            <h2>Create Category</h2>
            <input type="text" id="categoryName" placeholder="Category Name">
            <input type="number" id="weightCategory" placeholder="Weight ( in kg)" min="0">
            <input type="number" id="categoryPricePerUnit" placeholder="Price Per Unit">
            
            <button onclick="saveCategory()">Create</button>
            </div>
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
    }else if(testID(weight)||testprice(pricePerUnit)){
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
    
    
    Categories.push({id, name,weight,pricePerUnit,"stock":0})
    for (category of inventory){
        const IPID=PackInventory.length+1
        PackInventory.push({IPID,itemId:category.itemId,packId:id,stock:0})
    }
    updateStorage()
    loadPacking()
}
function confirmAddition(event){
    const id =parseInt(event.target.getAttribute("data-id"))
    const packInv=PackInventory.find(inv=> inv.IPID===id)

    const amount = parseInt(document.getElementById("addingAmount").value);
    if(amount==""){
        createToast("Please Fill All the Boxes")
        return
    }else if (testID(amount)){
        createToast("Only Positive number accepted")
        return
    }else if(amount<=0){
        createToast("The Amount must be greater than 0")
        return

    }
    const pack=Categories.find(pack=>pack.id===packInv.packId)
    const weight=amount*pack.weight
    const category =inventory.find(cate=>cate.itemId===packInv.itemId)
    if(weight>category.stock){
        createToast(`not Avaliable Amount (The avalible amount is ${category.stock} Kg`)
        return
    }
    category.stock-=weight
    packInv.stock+=amount
    pack.stock+=amount
    createToast("Pack created Successfully")
    updateStorage()
    loadPacking()


}
// ------------------- Utility Functions -------------------










function formatCurrency(number) {
    return `$${number.toFixed(2)}`;
}









// ------------------- Inventory Management -------------------


function loadInventory() {
    const content = document.getElementById("content");
    const lowStockItems = inventory.filter(item => item.stock < item.ReorderLevel);
    const html = `
        <div class="card">
            <h2>Inventory Management</h2>
            <button id ="DemandForecast" >Demand forecast (Week)</button>
            <button id="inventorySummaries">Generate Report</button>
            <div id="ISecond-part">
            <ul>
                ${inventory.map(item => `
                    <li class= "Inventory-box">
                        <span>${item.itemId}</span>
                        <span>${item.category} : ${item.stock}kg </span>
                        <span>Reorder Level: ${item.ReorderLevel}kg</span>
                        <span>Restock Date: ${formatDate(new Date(item.RestockDate))}</span>

                        <button onclick="addPurchase()">Update Stock</button>
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
    document.getElementById("inventorySummaries").addEventListener("click",inventorySummaries)
    document.getElementById("DemandForecast").addEventListener("click",()=>{
        const weeklist=inventoryTime("week")
        demandForecast(weeklist)
    })
}
function generateReport(){
    let TotalFresh=0;
    purchaseslist.filter(purchase=>purchase.category==="Fresh").forEach(purchase=>TotalFresh+=purchase.totalCost)
    let TotalOrganic=0
    purchaseslist.filter(purchase=>purchase.category==="Organic").forEach(purchase=>TotalOrganic+=purchase.totalCost)
    let TotalFrozen=0
    purchaseslist.filter(purchase=>purchase.category==="Frozen").forEach(purchase=>TotalFrozen+=purchase.totalCost)
    const html=`
    <div class="card">
    <h2>Raw Materials Report</h2>
        <span> Fresh Blueberries: ${TotalFresh} $</span>
        <div><span> Organic Blueberries: ${TotalOrganic} $</span></div>
        <div><span> Frozen Blueberries: ${TotalFrozen} $</span></div>


    </div>
    `
    updateContent(html)
}







function inventorySummaries(){
    const seconbox=document.getElementById("ISecond-part")
    seconbox.innerHTML=`<select>
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
                </select>
                <button onclick="showinventorysummary()"> Show</button>`
}
function showinventorysummary(){
    const time=document.querySelector("select").value
    const todayDate=new Date()
    let filteredlist=[]
    if(time==="day"){
         filteredlist=purchaseslist.filter(purchase=>(todayDate-new Date(purchase.date))/(1000*60*60*24) <=1)
    }else if (time==="week"){
        
         filteredlist=purchaseslist.filter(purchase=>(todayDate-new Date(purchase.date))/(1000*60*60*24) <=7)
    }else if(time==="month"){
       
        filteredlist=purchaseslist.filter(purchase=>todayDate.getFullYear()===new Date(purchase.date).getFullYear() && todayDate.getMonth()===new Date(purchase.date).getMonth())
            

    }
    let timeExpenses=0
    let TotalFrozen=0
    let totalFresh=0
    let TotalOrganic=0
    const FrozenPurchses=filteredlist.filter(purchase=>purchase.category==="Frozen")
    const OrganicPurchses=filteredlist.filter(purchase=>purchase.category==="Organic")
    const FreshPurchses=filteredlist.filter(purchase=>purchase.category==="Fresh")
    if(FrozenPurchses){
        FrozenPurchses.forEach(frozen=>TotalFrozen+=frozen.quantity)
    }
    if(OrganicPurchses){
        OrganicPurchses.forEach(organic=>TotalOrganic+=organic.quantity)
    }
    if(FreshPurchses){
        FreshPurchses.forEach(fresh=>totalFresh+=fresh.quantity)
    }

    const seconbox=document.getElementById("ISecond-part")
    seconbox.innerHTML=`<h2>Total incomming material For Last ${time}</h2>
    <div id="invetory-report-box">
    <span> Frozen :${TotalFrozen}</span>
    <span> Orgnaic${TotalOrganic}</span>
    <span>Fresh ${totalFresh}</span>
    </div>`


}









function addInventory() {
    const html = `
        <div class="card">
        <div class ="add-edit-box">
            <h2>Add Inventory</h2>
            <input type="text" id="inventoryCategory" placeholder="Category">
            <input type="number" id="inventoryStock" placeholder="Stock">
            <input type="number" id="inventoryPrice" placeholder="Price per unit">
            <button onclick="saveInventory()">Save Inventory</button>
            </div>
        </div>
    `;
    updateContent(html);
}


async function saveInventory() {
    if (!validateFields({ inventoryCategory: "text", inventoryStock: "number", inventoryPrice: "number" })) return;
    const category = document.getElementById("inventoryCategory").value;
    const stock = parseInt(document.getElementById("inventoryStock").value);
    const pricePerUnit = parseFloat(document.getElementById("inventoryPrice").value);

    const inventory = await fetchData("./data/inventory.json");
    inventory.push({ category, stock, pricePerUnit });
    await saveData("./data/inventory.json", inventory);
    updateStorage()
    loadInventory();
}
function inventoryTime(timeperiod){//this generates a list of the purchases for time  certain period
    const todayDate =new Date();
    let filteredlist=[]
    if(timeperiod==="day"){
         filteredlist=Orders.filter(order=>{(todayDate-new Date(order.Date))/(1000*60*60*24) <=1})
    }else if (timeperiod==="week"){
        
         filteredlist=Orders.filter(order=>(todayDate-new Date(order.Date))/(1000*60*60*24) <=7)
    }else if(timeperiod==="month"){
         filteredlist=Orders.filter(order=>{todayDate.getFullYear()===new Date(order.Date).getFullYear() && todayDate.getMonth()===new Date(order.Date).getMonth()})
    }else 
     filteredlist=Orders

    return filteredlist
}
function demandForecast(list){
    let demandlist={};
    list.forEach(order=>order.Products.forEach(product=>{
        if(!demandlist[product.Category]){
            demandlist[product.Category]={total:0,count:0}
        }
        demandlist[product.Category].total+=product.Quantity*Categories.find(cate=>cate.name===product.Pack).weight
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
    let listingDiv=document.getElementById("ISecond-part")
    listingDiv.innerHTML=`<ul>
                ${forecasted.map(item => `
                    <li class="demandforecast-box">
                        <span> Category: ${item.category}</span>
                        <span> Total Sales ${item.totalSales} Kg</span>
                        <span>Prediction For the next Week: ${item.prediction} Kg</span>
                    
                    </li>`).join('')}
            </ul>`
}

// ------------------- Sales Management -------------------


function loadOrders() {
    TotalRevenue=0
    Orders.forEach(order=>TotalRevenue+=order.TotalPrice)
    const html = `
        <div class="card">
            <h2>Orders</h2>
            <span>Sorting Options</span>
            <button onclick="sortOrder('Status')"> Status</button>
            <button onclick="sortOrder('Customer')"> Customer</button>
            <button onclick="sortOrder('Category')">Category</button>
            <button onclick="sortbytimeboxSales()">Time Period</button>
            <button onclick="generateReportSales()">Generate Report</button>
            <button onclick="calculateSelectedOrders()">Calculate Selected</button>
            <button onclick="visualReports()">Visual Reports</button>

            
            <div id="OSecond-part">
            <ul>
                ${Orders.map(order => `<li class="order-box"><input type="checkbox" class="order-checkbox" data-orderid="${order.orderId}"><span>Customer Name: ${order.CusName}</span> ${order.Products.map(product=>`<span>${product.Pack} (${product.Category}) : ${product.Quantity} units</span>`).join("")}<span>Total Price: ${order.TotalPrice} $</span><span> Date : ${ formatDate(new Date(order.Date))} </span>
                    <select class="StatusSelect" data-id=${order.orderId} >
                <option value="${order.Status}">${order.Status}</option>
                <option value="Pending">Pending</option>
                <option value="Processed">Processed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                </select>
                <button class="update-status" data-id="${order.orderId}">Update</button>
                </li>`).join("")}
            </ul>
            <div>Total Revenue : ${TotalRevenue}</div>
            <button onclick="addSale()">Add Sale</button>
            
            </div>
        </div>
    `;
    
    
    updateContent(html);
    document.querySelectorAll(".update-status").forEach(btn=>btn.addEventListener("click",Updatestatus))
}
function visualReports(){
    let listingDiv=document.getElementById("OSecond-part")
    listingDiv.innerHTML=`<div id="ChartBox">
                <h2>Sales Trends</h2>
                <canvas id="salesBarChart"></canvas>
            </div>`

        renderCharts();
}
function sortbytimeboxSales(){
    
    const listingDiv=document.getElementById("OSecond-part")
    listingDiv.innerHTML=`<input type="date" id="startDate" placeholder="Start Date"></input>
    <input type="date" id="endDate" placeholder="End Date"></input>
    <button onclick="sortbytimeSales()">sort</button>`
}
function sortbytimeSales(){
    const listingDiv=document.getElementById("OSecond-part")
    const startDate=new Date(document.getElementById("startDate").value)
    const endDate=new Date(document.getElementById("endDate").value)
    
    if(startDate>endDate||!startDate||!endDate){
        createToast("unacceptable Time Period")
        return
    }
    const filteredList=Orders.filter(order=>startDate<=new Date(order.Date)&& new Date(order.Date)<=endDate)
    
    let timeperiodRevenue=0
    filteredList.forEach(order=>timeperiodRevenue+=order.TotalPrice)
    listingDiv.innerHTML = `<ul>
    ${filteredList.map(order => `<li class="order-box"><input type="checkbox" class="order-checkbox" data-orderid="${order.orderId}"><span>Customer Name: ${order.CusName}</span> ${order.Products.map(product=>`<span>${product.Pack} (${product.Category}) : ${product.Quantity} units</span>`).join("")}<span>Total Price: ${order.TotalPrice} $</span><span> Date : ${ formatDate(new Date(order.Date))} </span>
        <select class="StatusSelect" data-id=${order.orderId} >
    <option value="${order.Status}">${order.Status}</option>
    <option value="Pending">Pending</option>
    <option value="Processed">Processed</option>
    <option value="Shipped">Shipped</option>
    <option value="Delivered">Delivered</option>
    </select>
    <button class="update-status" data-id="${order.orderId}">Update</button>
    </li>`).join("")}
    <h3>Time Period Revenue</h3>
            <span> :${timeperiodRevenue} $</span>
    </ul>
`; 

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
                <button onclick="sortStatus()"> Show</button>`;
        }else if (sortingCondition==="Customer"){
            
        listingDiv.innerHTML=`<input type="text" id="CustomerName" placeholder="Cutomer Name">
        <button onclick="sortOrderByName()">Show</button>`
        }else{
            listingDiv.innerHTML=`<select>
            ${Categories.map(category=>`<option value="${category.name}"> ${category.name}</option>`).join("")}
                </select>
                <button onclick="sortCategory()">Show</button>`;
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
    const filteredList=[]
    for(o in Orders){
        for( p in Orders[o].Products){
            if (Orders[o].Products[p].Pack===category){
                filteredList.push(Orders[o])
                break;
            }
        }
    }
    list_sorted(filteredList)
}
function list_sorted(list){
    const listingDiv=document.getElementById("OSecond-part")    
    listingDiv.innerHTML = `
    <ul>

                ${list.map(order => `<li class="order-box"><span>Customer Name: ${order.CusName}</span> ${order.Products.map(product=>`<span>${product.Pack} (${product.Category}) : ${product.Quantity} units</span>`).join("")}<span>Total Price: ${order.TotalPrice} $</span>
                    <select class="StatusSelect" data-id=${order.orderId} >
                <option value="${order.Status}">${order.Status}</option>
                <option value="Pending">Pending</option>
                <option value="Processed">Processed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                </select>
                <button class="update-status" data-id="${order.orderId}">Update</button>
                </li>`).join("")}
            </ul>
    
`; 
}
function calculateSelectedOrders() {
    const checkedBoxes = document.querySelectorAll('.order-checkbox:checked');
    let totalSelected = 0;
    checkedBoxes.forEach(box => {
        const orderId = box.dataset.orderid;
        const order = Orders.find(o => o.orderId === parseInt(orderId));
        if (order) {
            totalSelected += order.TotalPrice;
        }
    });
    createToast(`Total cost for selected orders: $${totalSelected}`);
}
function Updatestatus(event){
    const id = parseInt(event.target.getAttribute("data-id"))
    const order=Orders.find(order=> order.orderId===id)
   order.Status=document.querySelector(`.StatusSelect[data-id="${id}"]`).value
   updateStorage()
    loadOrders()
    createToast("Updated Successfully")
    updateStorage()
    
}



function addSale() {
    const html = `
        <div class="card">
            <div id="add-sale-box" class ="add-edit-box">
                <h2>Add Sale</h2>
                <input type="text" id="CusName" placeholder="Customer Name">
                <input type="text" id="CusContact" placeholder="Contact Info">
                <input type="text" id="ShippingInfo" placeholder="Shipping Info">
                <div id="category-selection">
                    <div class="cateBox">
                    <select class="packSelect" >
                    <option value="">Select a Category</option>
                    ${Categories.map(category=>`<option value="${category.name}"> ${category.name}</option>`).join("")}
                    </select>
                    <select class="categorySelect">
                    <option value="Frozen">Frozen</option>
                    <option value="Organic">Organic</option>
                    <option value="Fresh">Fresh</option>
                    </select >
                    <lable for="Quantity"> Quantity</label>
                    <input type="number" id="Quantity" placeholder="Quantity" min =1 value=1>
                    </div>
                    
                </div>
                <button onclick="addProduct()">Add Product</button>
                <button onclick="saveSale()">Save</button>
            </div>
        </div>
    `;
    updateContent(html);
}
function addProduct(){
   
    const category_box=document.getElementById("category-selection")
    let select_box=document.createElement("div")
    select_box.classList.add("cateBox")
    select_box.innerHTML=`<select class="packSelect" ><option value="">Select a Category</option>
    ${Categories.map(category=>`<option value="${category.name}" > ${category.name}</option>`).join("")}
    </select>
    <select class="categorySelect">
                <option value="Frozen">Frozen</option>
                <option value="Organic">Organic</option>
                <option value="Fresh">Fresh</option>
                
                </select >
    <input type="number" id="Quantity" placeholder="Quantity" min =1 value=1>
    <button id="remove-addition-box">Remove</button>`
    category_box.appendChild(select_box)
    document.getElementById("remove-addition-box").addEventListener("click", (event)=>{
        document.getElementById("remove-addition-box").parentElement.remove();
    })
}

function saveSale() {
    const CusName = document.getElementById("CusName").value.trim();
    const CusContact = document.getElementById("CusContact").value.trim();
    const CusShippingInfo =document.getElementById("ShippingInfo").value.trim();
    let pack; //pack name
    let category;
    let Quantity;
    let Products=[]
    let packInv;
    let order={}
    const boxes=document.querySelectorAll(".cateBox")
    for(const box of boxes){
        pack =box.querySelector(".packSelect").value
        category=box.querySelector(".categorySelect").value
        
        Quantity= parseInt( box.querySelector("input").value)
        
        if(!category||!Quantity||!pack){
            
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
        
        const Category=inventory.find(inv=>inv.category===category)
        
        const Pack=Categories.find(cate=>cate.name===pack)
        packInv=PackInventory.find(Pi=>Pack.id===Pi.packId && Category.itemId===Pi.itemId)
        if(order[packInv.IPID]){
            createToast("The same product exists more than one time")
            return
        }
        order[packInv.IPID]=true
        
        
        if (packInv.stock<Quantity){
                createToast(`No enough packs to make the sale (the number of avaliable packs is ${packInv.stock} packs`)
                return
        }
        else{
            
            const Price=Categories.find(cate=>cate.name===pack)["pricePerUnit"] //The Price Here is The Unit Price , not The Total Price
            const product = {
                "Pack":pack,
                "Category": category,
                "Quantity": Quantity,
                "Price": Price
            };
            Products.push(product)
            
        }
    
    }

    
    let TotalPrice=0;
    Products.forEach(cate=>TotalPrice+=cate.Quantity*cate.Price)
    if(CusName===""|| CusContact ==="" || CusShippingInfo===""){
        createToast("Please fill all the boxes")
        return
    }else if(testspecialcharss(CusName)){
        createToast("Special Chars Not accepted for the name");
        return;
    }
    const orderId= Orders.length +1
    packInv.stock-=Quantity;
    TotalRevenue+=TotalPrice
    Orders.push({orderId ,CusName,CusContact,CusShippingInfo,Products,TotalPrice,"Status":"Pending","Date":new Date})
    
    loadOrders();
    updateStorage()
}


function generateReportSales(){
    let demandlist={};
    Orders.forEach(order=>order.Products.forEach(product=>{
        if(!demandlist[product.Pack]){
            demandlist[product.Pack]={total:0,revenue:0}
        }
        demandlist[product.Pack].total+= product.Quantity
        demandlist[product.Pack].revenue+= product.Quantity *product.Price
        
    }))
    const html = `
        <div class="card">
        <div id = "Report">
            ${Object.keys(demandlist).map(pack=>`<p> Pack : ${pack} , Sold: ${demandlist[pack].total} , Revenue : ${demandlist[pack].revenue}`).join("")}
            </div>
        </div>
    `;
    
    updateContent(html);
}



//========================financialAnalysis====================
function financialAnalysis(){
    const html=`<div class ="add-edit-box">
    <h2>Enter The Tax Rate</h2>
    <input type="number" id ="tax" placeholder="Tax rate">
    <select>
                <option value="">Select Time Period</option>
                <option value="month">Month</option>
                <option value="threemonth">3 Moths</option>
                <option value="sixmonth">6 Months</option>
                </select>
    <button onclick="calculatefinancialAnalysis()">Calculate</button>
    </div>
    `
    updateContent(html)
}
function calculatefinancialAnalysis(){
    let taxrate =document.getElementById("tax").value;
    const timeperiod=document.querySelector("select").value;
    if(taxrate==="" || timeperiod===""){
        createToast("Fill The Box")
        return
    }else if (testprice(taxrate)){
        createToast("spiecial Chars not accepted")
        return
    }else if (taxrate<=0 || taxrate>=100){
        createToast("The Tax Rate Should be between 0 and 100")
        return
    }
    const timetotalExpenses= calculateexpenses(timeperiod);
    const timetotalrevenue=calculate_revenue(timeperiod)
    
    taxrate=parseFloat(taxrate/100);
    
    const html=`<div id = "FinancialAnalysis"><h2>FinancialAnalysis for the last ${timeperiod.toUpperCase()}</h2>
    <p>Total Income : ${timetotalrevenue}</p>
    <p>Total Expenses : ${timetotalExpenses}</p>
    <p>Total Tax : ${formatCurrency(timetotalrevenue*taxrate)}</p>
    <p>Net Profit : ${timetotalrevenue-timetotalExpenses-timetotalrevenue*taxrate}</p>
    </div>
    `
    updateContent(html)
}
// ------------------- Reports -------------------

function generateReports(){
    const html=`<div class ="add-edit-box">
    <h2>Enter The Tax Rate</h2>
    <input type="number" id ="tax" placeholder="Tax rate">
    <select>
                <option value="">Select Time Period</option>
                <option value="month">Month</option>
                <option value="threemonth">3 Moths</option>
                <option value="sixmonth">6 Months</option>
                </select>
    <button onclick="showgenerateReports()">Calculate</button>
    </div>
    `
    updateContent(html)
}
async function showgenerateReports() {
    let taxrate =document.getElementById("tax").value;
    const timeperiod=document.querySelector("select").value;
    if(taxrate==="" || timeperiod===""){
        createToast("Fill The Box")
        return
    }else if (testprice(taxrate)){
        createToast("spiecial Chars not accepted")
        return
    }else if (taxrate<=0 || taxrate>=100){
        createToast("The Tax Rate Should be between 0 and 100")
        return
    }
    const timetotalExpenses= calculateexpenses(timeperiod);
    const timetotalrevenue=calculate_revenue(timeperiod)
    
    taxrate=parseFloat(taxrate/100);


    let filteredOrders;
        const todayDate=new Date();
        let totalExpenses=0;
        let filteredlist;
         if (timeperiod==="month"){
            filteredOrders=Orders.filter(order=>todayDate.getFullYear()===new Date(order.Date).getFullYear() && todayDate.getMonth()===new Date(order.Date).getMonth())
            
        }else if (timeperiod==="threemonth"){
            filteredOrders=Orders.filter(order=>todayDate.getFullYear()===new Date(order.Date).getFullYear() && (todayDate.getMonth()-new Date(order.Date).getMonth()<=3))
            
        }else if (timeperiod==="sixmonth"){
            filteredOrders=Orders.filter(order=>todayDate.getFullYear()===new Date(order.Date).getFullYear() && (todayDate.getMonth()-new Date(order.Date).getMonth()<=6))
            
        }
    let demandlist={};
    filteredOrders.forEach(order=>order.Products.forEach(product=>{
        if(!demandlist[product.Category]){
            demandlist[product.Category]={total:0}
        }
        demandlist[product.Category].total+= product.Quantity*(Categories.find(cate=>cate.name===product.Pack).weight)
        
    }))
    let demandlistpacks={};
    filteredOrders.forEach(order=>order.Products.forEach(product=>{
        if(!demandlistpacks[product.Pack]){
            demandlistpacks[product.Pack]={total:0}
        }
        demandlistpacks[product.Pack].total+= product.Quantity
        
    }))
    
    
    const Tax=timetotalrevenue*taxrate
    const netProfit= timetotalrevenue-timetotalExpenses-Tax
    const html = `
        <div class="card">
            <div id = "Report">
            <h2>All-Time Report</h2>
            <p>Total Revenue:${formatCurrency(timetotalrevenue)}$</p>
            <p>Expenses:${formatCurrency(timetotalExpenses)}$</p>
            <p>Total Tax:${formatCurrency(Tax)}$</p>
            <p>Net Profit :${formatCurrency(netProfit)}$</p>
            ${Object.keys(demandlist).map(category=> `<p> category: ${category} Sold ${demandlist[category].total} kg`).join("")}
            ${Object.keys(demandlistpacks).map(pack=> `<p> Pack: ${pack} Sold ${demandlistpacks[pack].total}`).join("")}
            ${inventory.map(item=>`<p> Category: ${item.category}  Remaining Stock: ${item.stock} Kg`).join("")}
            </div>
        </div>
    `;
    
    updateContent(html);
}




function addNavListeners() {
    document.getElementById("manageFarmers").addEventListener("click", loadFarmers);
    document.getElementById("managePurchases").addEventListener("click", loadPurchases);
    document.getElementById("inventoryManagement").addEventListener("click", loadInventory);
    document.getElementById("catogaryPackingManagement").addEventListener("click", loadPacking)
    document.getElementById("salesManagement").addEventListener("click", loadOrders);
    document.getElementById("generateReports").addEventListener("click", generateReports);
    document.getElementById("financialAnalysis").addEventListener("click", financialAnalysis);
    
    
}



document.addEventListener("DOMContentLoaded",()=>{
    addNavListeners();
})




//==============Sales Trend=====================
function renderCharts() {
    let slls=[];
    Orders.forEach(order=>order.Products.forEach(product=>slls.push(product)))
    const categories = [...new Set(slls.map(sale => sale.Pack))]; 
    const data = categories.map(category => {
        return slls.filter(sale => sale.Pack === category).reduce((tot, curr) => tot + curr.Quantity, 0);
    });
    if(window.barChartInstance){
        window.barChartInstance.destroy();}
    const ctxBar =document.getElementById(`salesBarChart`).getContext(`2d`);
    window.barChartInstance=new Chart(ctxBar,{
        type: `bar`,
        data:{ labels:categories,datasets:[{
            label:`Total Sales by Packs`,data:data,borderColor:["#EC5B24","#2497EC","#24EC61" ],backgroundColor:["#DA310B","#0C276A","#1BA038"]
            ,borderWidth:1
        }]
        ,options:{scales:{y:{beginAtZero:true}}}}
    });
}



