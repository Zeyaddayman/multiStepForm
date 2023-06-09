const steps = document.querySelectorAll(".step");
const infoInputs = document.querySelectorAll(".step-0 section form div input");
const controlBtns = document.querySelectorAll(".control-btn");
const optionsCheckBox = document.querySelector(".step-1 .options label input");
const planOffers = document.querySelectorAll(".step-1 .plan .box label .info .offer");
const planOptions = document.querySelectorAll(".options span");
const allPrices = document.querySelectorAll("span.price");
const summaryPlan = document.querySelector(".step-3 .summary .plan .info h4")
const summaryPlanPrice = document.querySelector(".step-3 .summary .plan .price");
const summaryOns = document.querySelector(".step-3 .summary .ons");
const total = document.querySelector(".step-3 .total");

const user = {
    allOns: {},
};

const prices = {
    "month": {
        arcade: "$9/mo",
        advanced: "$12/mo",
        pro: "$15/mo",
        "online service": "+$1/mo",
        "larger storage": "+$2/mo",
        "customizable profile": "+$2/mo",
        abbreviation: "mo"
    },
    "year": {
        arcade: "$90/yr",
        advanced: "$120/yr",
        pro: "$150/yr",
        "online service": "+$10/yr",
        "larger storage": "+$20/yr",
        "customizable profile": "+$20/yr",
        abbreviation: "yr"
    }
}

let planMode = "month";

let offerValue = "2 months free";

showPrices(planMode);
showOffers(false);

infoInputs.forEach((input) => {
    input.onblur = function () {
        checkInput(input);
    }
    input.onkeyup = function () {
        checkInput(input);
    }
})

function checkInput (input) {
    let span = document.querySelector(`.step-0 section form .${input.parentElement.className} span.required`);
    if (input.value.length < 1) {
        span.style.display = "inline";
        input.classList.remove("ready");
    } else {
        span.style.display = "none";
        input.classList.add("ready");
    }
    let readyInputs = document.querySelectorAll(".step-0 section form div input.ready");
    if (readyInputs.length === document.querySelectorAll(".step-0 section form div input").length) {
        controlBtns[1].removeAttribute("disabled");
    } else {
        controlBtns[1].setAttribute("disabled", "");
    }
}

controlBtns.forEach((btn) => {
    btn.onclick = function () {
        if (btn.id === "confirm") {
            sendData();
        } else {
            hidesteps();
            showstep(document.querySelector(`.step-${btn.id}`));
            saveData(btn);
        }
    }
})

function hidesteps () {
    steps.forEach((step) => step.style.display = "none");
}

function showstep (step) {
    step.style.display = "block";
}

optionsCheckBox.onclick = function () {
    if (optionsCheckBox.checked) {
        planMode = "year";
        optionsUX();
        showOffers(true);
        showPrices(planMode);
    } else {
        planMode = "month";
        optionsUX();
        showOffers(false);
        showPrices(planMode);
    }
}

function optionsUX () {
    planOptions.forEach((option) => {
        if (option.classList.contains(planMode)) {
            option.classList.add("active");
        } else {
            option.classList.remove("active");
        }
    })
}

function showOffers (year) {
    planOffers.forEach((offer) => {
        year ? offer.innerHTML = offerValue : offer.innerHTML = "";
    })
}

function showPrices (planMode) {
    let i = 0;
    for (value in prices[planMode]) {
        allPrices[i].innerHTML = prices[planMode][value];
        i++;
    }
}

function saveData (btn) {
    if (btn.classList.contains("info-data")) {
        user.name = document.querySelector(".step-0 form .name input").value;
        user.email = document.querySelector(".step-0 form .email input").value;
        user.phone = document.querySelector(".step-0 form .phone input").value;
    } else if (btn.classList.contains("plan-data")) {
        let plan = document.querySelector(".step-1 .plan input[type='radio']:checked + .box .info h4").innerHTML;
        user.plan = plan.toLocaleLowerCase();
        user.planPrice = prices[planMode][user.plan];
    } else if (btn.classList.contains("ons-data")) {
        user.allOns = {};
        document.querySelectorAll(".step-2 .add-ons input[type='checkbox']:checked + .box label h4").forEach((ons) => {
            let onsTitle = ons.innerHTML;
            user.allOns[onsTitle] = prices[planMode][onsTitle.toLocaleLowerCase()];
        })
        showSummary();
    }
}

function showSummary () {
    summaryPlan.innerHTML = `${user.plan} <span>(${planMode}ly)</span>`;
    summaryPlanPrice.innerHTML = user.planPrice;
    summaryOns.innerHTML = "";
    let arr = [user.planPrice];
    for (value in user.allOns) {
        let ons = `<p>${value}<span>${user.allOns[value]}</span></p>`;
        summaryOns.innerHTML += ons;
        arr.push(user.allOns[value]);
    }
    let totalPrice = arr.map((x) => +(x.split("").map((x) => x.replace(/\D/g, "")).join("")));
    totalPrice = totalPrice.reduce((acc, current) => acc + current);
    total.innerHTML = `<p>Total <span class='mode'>(per ${planMode})</span> <span class='total-price'>+$${totalPrice}/${prices[planMode].abbreviation}</span></p>`;
    user.total = totalPrice;        
}

function sendData () {
    hidesteps();
    document.querySelector(".step-3 section div.thank-you").style.display = "flex";
    document.querySelector(".step-3 section div.finish").style.display = "none";
    showstep(document.querySelector(`.step-3`));
    console.log(user);
}