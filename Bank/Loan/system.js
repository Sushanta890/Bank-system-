
// LOAD DATABASE

let users=JSON.parse(localStorage.getItem("skUsers"))||[];
let loans=JSON.parse(localStorage.getItem("skLoans"))||[];
let tx=JSON.parse(localStorage.getItem("skTx"))||[];


// LOGIN

function login(){

let acc=account.value;
let mob=mobile.value;

let user=users.find(u=>u.account==acc && u.mobile==mob);

if(user){

localStorage.setItem("currentUser",acc);

location="bank.html";

}else{

alert("Invalid login");

}

}


// ADMIN LOGIN

function adminLogin(){

let pass=prompt("Password");

if(pass=="admin123"){

location="admin.html";

}

}


// DASHBOARD

if(location.pathname.includes("bank.html")){

let acc=localStorage.getItem("currentUser");

let user=users.find(u=>u.account==acc);

info.innerHTML=

`Account: ${user.account}<br>
Balance: ₹${user.balance||0}`;

}


// APPLY LOAN

function applyLoan(){

let acc=localStorage.getItem("currentUser");

let amount=parseFloat(loanAmount.value);

let interest=parseFloat(loanInterest.value);

let months=parseInt(loanMonths.value);

let total=amount+(amount*interest/100);

let emi=total/months;

let loan={

account:acc,

amount:amount,

interest:interest,

total:total,

emi:emi,

months:months,

paid:0,

status:"Pending"

};

loans.push(loan);

localStorage.setItem("skLoans",JSON.stringify(loans));

alert("Loan Applied");

}


// ADMIN PANEL

if(location.pathname.includes("admin.html")){

loans.forEach((loan,i)=>{

let row=table.insertRow();

row.insertCell(0).innerText=loan.account;
row.insertCell(1).innerText=loan.amount;
row.insertCell(2).innerText=loan.interest;
row.insertCell(3).innerText=loan.total;
row.insertCell(4).innerText=loan.status;

let btn=row.insertCell(5);

let approve=document.createElement("button");

approve.innerText="Approve";

approve.onclick=function(){

loan.status="Approved";

let user=users.find(u=>u.account==loan.account);

user.balance=(user.balance||0)+loan.amount;

tx.push({

date:new Date().toLocaleString(),

type:"Loan Credit",

amount:loan.amount,

balance:user.balance,

account:loan.account

});

localStorage.setItem("skUsers",JSON.stringify(users));
localStorage.setItem("skLoans",JSON.stringify(loans));
localStorage.setItem("skTx",JSON.stringify(tx));

location.reload();

};

btn.appendChild(approve);

});

}


// EMI PAYMENT

function payEMI(){

let acc=localStorage.getItem("currentUser");

let user=users.find(u=>u.account==acc);

let loan=loans.find(l=>l.account==acc && l.status=="Approved" && l.paid<l.total);

if(!loan){

alert("No loan");

return;

}

if(user.balance<loan.emi){

alert("Insufficient balance");

return;

}

user.balance-=loan.emi;

loan.paid+=loan.emi;

tx.push({

date:new Date().toLocaleString(),

type:"EMI Paid",

amount:loan.emi,

balance:user.balance,

account:acc

});

localStorage.setItem("skUsers",JSON.stringify(users));
localStorage.setItem("skLoans",JSON.stringify(loans));
localStorage.setItem("skTx",JSON.stringify(tx));

alert("EMI Paid");

location.reload();

}


// PASSBOOK

function passbook(){

location="passbook.html";

}

if(location.pathname.includes("passbook.html")){

let acc=localStorage.getItem("currentUser");

tx.forEach(t=>{

if(t.account==acc){

let row=passbook.insertRow();

row.insertCell(0).innerText=t.date;
row.insertCell(1).innerText=t.type;
row.insertCell(2).innerText=t.amount;
row.insertCell(3).innerText=t.balance;

}

});

}


// LOGOUT

function logout(){

localStorage.removeItem("currentUser");

location="index.html";

}