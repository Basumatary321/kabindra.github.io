
let transactions=JSON.parse(localStorage.getItem("transactions"))||[];
// let deleteIndex=null;
let editIndex=null;
let chart1=null;
let chart2=null;
let deleteIndex=null;
let currentPage="home";
let editFeeIndex=null;

function save(){

localStorage.setItem("transactions",JSON.stringify(transactions));

}

function render(){

let container=document.getElementById("transactions");

container.innerHTML="";

let cash=0,bank=0,income=0,expense=0;

transactions.forEach((t,i)=>{

let amt=parseFloat(t.amount);

let color=amt>0?"amountGreen":"amountRed";

let div=document.createElement("div");

div.className="transaction";

div.innerHTML=`

<div>

<p>${t.desc}</p>

 <small>${t.date || ""} • ${t.mode}</small>

</div>

<div>

<span class="${color}">${t.amount}</span>

<span class="actions">

<i class="fa fa-edit" onclick="edit(${i})" style="color:orange;"></i>

<i class="fa fa-trash" onclick="del(${i})" style="color:red;"></i>

</span>

</div>

`;

container.appendChild(div);

if(t.mode=="Cash") cash+=amt;
if(t.mode=="Bank" || t.mode=="UPI") bank+=amt;

if(amt>0)income+=amt;
else expense+=amt;

});

document.getElementById("cash").innerText="₹"+cash;
document.getElementById("bank").innerText="₹"+bank;
document.getElementById("income").innerText="₹"+income;
document.getElementById("expense").innerText="₹"+expense;

document.getElementById("balance").innerText="₹"+(cash+bank);

}

function addTransaction(){

let desc=document.getElementById("desc").value;

let amount=document.getElementById("amount").value;

let mode=document.getElementById("mode").value;

if(desc==""||amount=="")return;

if(editIndex===null){

transactions.push({
desc,
amount,
mode,
date:new Date().toLocaleDateString()
});

}else{

transactions[editIndex]={
desc,
amount,
mode,
date:transactions[editIndex].date
};

editIndex=null;

}

save();

render();

closeForm();
document.getElementById("desc").value="";
document.getElementById("amount").value="";

}
function closeT(){
    document.getElementById("form").style.display="none"; 
}

function del(i){

deleteIndex=i;

document.getElementById("deletePopup").style.display="flex";

}

function edit(i){

let t=transactions[i];

document.getElementById("desc").value=t.desc;
document.getElementById("amount").value=t.amount;
document.getElementById("mode").value=t.mode;

editIndex=i;

openForm();

}

function openForm(){

document.getElementById("form").style.display="block";

}

function closeForm(){

document.getElementById("form").style.display="none";

}

  function showDashboard(){
currentPage="home";
document.querySelector(".fab i").className="fa fa-plus";

document.getElementById("history").style.display="block";
document.getElementById("reports").style.display="none";
document.getElementById("fees").style.display="none";
}

function showHistory(){

currentPage="home";

showDashboard();

}

 function showReports(){
currentPage="reports";
document.querySelector(".fab i").className="fa fa-plus";

document.getElementById("history").style.display="none";
document.getElementById("fees").style.display="none";
document.getElementById("reports").style.display="block";

drawCharts();
}

function showFees(){

currentPage="fees";
document.querySelector(".fab i").className="fa fa-money-bill";
document.getElementById("history").style.display="none";
document.getElementById("reports").style.display="none";
document.getElementById("fees").style.display="block";

renderFees();

}



 function drawCharts(){

let income=0;
let expense=0;

let monthly={};

transactions.forEach(t=>{

let amt=parseFloat(t.amount);

if(amt>0) income+=amt;
else expense+=Math.abs(amt);

let date=t.date || new Date().toLocaleDateString();

let parts=date.split("/");

let key=parts[1]+"-"+parts[2];

if(!monthly[key]) monthly[key]=0;

monthly[key]+=amt;

});

/* destroy old charts */

if(chart1) chart1.destroy();
if(chart2) chart2.destroy();

/* PIE CHART */

chart1=new Chart(document.getElementById("chart1"),{

type:"pie",

data:{
labels:["Income","Expense"],
datasets:[{
label:"Finance",
data:[income,expense],
backgroundColor:["#22c55e","#ef4444"]
}]
},

options:{
responsive:true
}

});

/* LINE CHART */

chart2=new Chart(document.getElementById("chart2"),{

type:"line",

data:{
labels:Object.keys(monthly),
datasets:[{
label:"Monthly Balance",
data:Object.values(monthly),
borderColor:"#3b82f6",
backgroundColor:"#3b82f6",
tension:0.3,
fill:false
}]
},

options:{
responsive:true,
plugins:{
legend:{
labels:{color:"white"}
}
},
scales:{
x:{
ticks:{color:"white"}
},
y:{
ticks:{color:"white"}
}
}
}

});

}
// chart end

render();

if("serviceWorker" in navigator){

navigator.serviceWorker.register("sw.js");

}
function closeDelete(){

document.getElementById("deletePopup").style.display="none";

}

function confirmDelete(){

transactions.splice(deleteIndex,1);

save();

render();

closeDelete();

}


// install app
let deferredPrompt;

const installBtn=document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt",(e)=>{

e.preventDefault();

deferredPrompt=e;

installBtn.style.display="inline-block";

});

installBtn.addEventListener("click",async()=>{

installBtn.style.display="none";

deferredPrompt.prompt();

const choice=await deferredPrompt.userChoice;

if(choice.outcome==="accepted"){

console.log("App installed");

}else{

console.log("Install cancelled");

}

deferredPrompt=null;

});

// fee
let fees=JSON.parse(localStorage.getItem("fees"))||[];

function saveFees(){
localStorage.setItem("fees",JSON.stringify(fees));
}

function renderFees(){

let container=document.getElementById("feeList");

container.innerHTML="";

fees.forEach((f,i)=>{

let div=document.createElement("div");

div.className="transaction";

div.innerHTML=`

<div>
<p>${f.name}</p>
<small>${f.date} • ${f.purpose}</small>
</div>

<div>
<span>₹${f.amount}</span>
<br>
<small>${f.submitted}</small>

<span class="actions">
<i class="fa fa-edit" onclick="editFee(${i})" style="color:orange;"></i>
<i class="fa fa-trash" onclick="deleteFee(${i})" style="color:red;"></i>
</span>

</div>

`;

container.appendChild(div);

});

}

 function addFee(){

let name=document.getElementById("studentName").value;
let amount=document.getElementById("feeAmount").value;
let purpose=document.getElementById("purpose").value;
let receiver=document.getElementById("receiver").value;
let submitted=document.getElementById("submitted").value;

if(editFeeIndex===null){

fees.push({
name,
amount,
purpose,
receiver,
submitted,
date:new Date().toLocaleDateString()
});

}else{

fees[editFeeIndex]={
name,
amount,
purpose,
receiver,
submitted,
date:fees[editFeeIndex].date
};

editFeeIndex=null;

}

saveFees();
renderFees();
closeFeeForm();

}

function openFeeForm(){
document.getElementById("feeForm").style.display="block";
}

function closeFeeForm(){
document.getElementById("feeForm").style.display="none";
}


// fee end
// fab
function handleFab(){

if(currentPage==="fees"){

openFeeForm();

}else{

openForm();

}

}
// edit fee
function editFee(i){

let f=fees[i];

document.getElementById("studentName").value=f.name;
document.getElementById("feeAmount").value=f.amount;
document.getElementById("purpose").value=f.purpose;
document.getElementById("receiver").value=f.receiver;
document.getElementById("submitted").value=f.submitted;

editFeeIndex=i;

openFeeForm();

}
// del fee
function deleteFee(i){

fees.splice(i,1);

saveFees();
renderFees();

}