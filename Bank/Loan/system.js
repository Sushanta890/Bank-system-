
// Load data
let users=JSON.parse(localStorage.getItem("skUsers"))||[];
let loans=JSON.parse(localStorage.getItem("skLoans"))||[];
let transactions=JSON.parse(localStorage.getItem("skTx"))||[];


// LOGIN SYSTEM

function login(){

let acc=document.getElementById("account").value;
let mob=document.getElementById("mobile").value;

let user=users.find(u=>u.account==acc && u.mobile==mob);

if(user){

localStorage.setItem("currentUser",acc);

location="bank.html";

}else{
alert("Invalid Login");
}

}


// ADMIN LOGIN

function adminLogin(){

let pass=prompt("Enter Admin Password");

if(pass=="admin123"){

location="admin.html";

}

}


// LOAD USER INFO

if(location.pathname.includes("bank.html")){

let acc=localStorage.getItem("currentUser");

let user=users.find(u=>u.account==acc);

document.getElementById("info").innerHTML=`

Account: ${user.account}<br>
Balance: ₹${user.balance||0}

`;

}


// EMI AUTO DEDUCT

function payEMI(){

let acc=localStorage.getItem("currentUser");

let user=users.find(u=>u.account==acc);

let loan=loans.find(l=>l.account==acc && l.status=="Approved");

if(!loan){alert("No loan"); return;}

let emi=loan.total/loan.months;

if(user.balance<emi){

alert("Insufficient balance");

return;
}

user.balance-=emi;

loan.paid=(loan.paid||0)+emi;

// transaction history

transactions.push({

date:new Date().toLocaleString(),
type:"EMI Paid",
amount:emi,
balance:user.balance,
account:acc

});

localStorage.setItem("skUsers",JSON.stringify(users));
localStorage.setItem("skLoans",JSON.stringify(loans));
localStorage.setItem("skTx",JSON.stringify(transactions));

alert("EMI Paid");

location.reload();

}


// PASSBOOK

function passbook(){

location="passbook.html";

}

if(location.pathname.includes("passbook.html")){

let acc=localStorage.getItem("currentUser");

let table=document.getElementById("passbook");

transactions.forEach(tx=>{

if(tx.account==acc){

let row=table.insertRow();

row.insertCell(0).innerText=tx.date;
row.insertCell(1).innerText=tx.type;
row.insertCell(2).innerText=tx.amount;
row.insertCell(3).innerText=tx.balance;

}

});

}


// ADMIN PANEL CONTROL

if(location.pathname.includes("admin.html")){

let table=document.getElementById("table");

loans.forEach((loan,index)=>{

let row=table.insertRow();

row.insertCell(0).innerText=loan.account;
row.insertCell(1).innerText=loan.amount;
row.insertCell(2).innerText=loan.interest;
row.insertCell(3).innerText=loan.status;

let btn=row.insertCell(4);

let approve=document.createElement("button");

approve.innerText="Approve";

approve.onclick=function(){

loan.status="Approved";

let user=users.find(u=>u.account==loan.account);

user.balance+=loan.amount;

localStorage.setItem("skUsers",JSON.stringify(users));
localStorage.setItem("skLoans",JSON.stringify(loans));

location.reload();

};

btn.appendChild(approve);

});

}


// LOGOUT

function logout(){

localStorage.removeItem("currentUser");

location="index.html";

}