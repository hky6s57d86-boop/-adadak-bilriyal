const defaultValues = {
  ground: 1625,
  apartmentOne: 144,
  apartmentTwo: 110,
  annex: 399
};

const targetBill = 2600;

let meterValues = loadValues();


function formatNumber(value) {
  return new Intl.NumberFormat("ar-SA", {
    maximumFractionDigits: 0
  }).format(value);
}


function loadValues() {
  const savedValues = localStorage.getItem("adadakValues");

  if (!savedValues) {
    return { ...defaultValues };
  }

  try {
    const parsedValues = JSON.parse(savedValues);

    return {
      ground: Number(parsedValues.ground) || 0,
      apartmentOne: Number(parsedValues.apartmentOne) || 0,
      apartmentTwo: Number(parsedValues.apartmentTwo) || 0,
      annex: Number(parsedValues.annex) || 0
    };
  } catch {
    return { ...defaultValues };
  }
}


function saveToDevice() {
  localStorage.setItem(
    "adadakValues",
    JSON.stringify(meterValues)
  );
}


function calculateTotal() {
  return (
    meterValues.ground +
    meterValues.apartmentOne +
    meterValues.apartmentTwo +
    meterValues.annex
  );
}


function calculatePercentage(value, total) {
  if (total === 0) {
    return 0;
  }

  return Math.round((value / total) * 100);
}


function setText(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.textContent = value;
  }
}


function setProgress(id, percentage) {
  const element = document.getElementById(id);

  if (element) {
    element.style.width = `${Math.min(percentage, 100)}%`;
  }
}


function updateDashboard() {
  const total = calculateTotal();

  const groundPercentage =
    calculatePercentage(meterValues.ground, total);

  const apartmentOnePercentage =
    calculatePercentage(meterValues.apartmentOne, total);

  const apartmentTwoPercentage =
    calculatePercentage(meterValues.apartmentTwo, total);

  const annexPercentage =
    calculatePercentage(meterValues.annex, total);

  const forecast = Math.round(total * 1.145);

  const mainProgress =
    Math.round((total / targetBill) * 100);

  const saving =
    Math.round(meterValues.ground * 0.1);


  setText("totalBill", formatNumber(total));

  setText(
    "forecastBill",
    formatNumber(forecast)
  );


  setText(
    "groundValue",
    formatNumber(meterValues.ground)
  );

  setText(
    "apartmentOneValue",
    formatNumber(meterValues.apartmentOne)
  );

  setText(
    "apartmentTwoValue",
    formatNumber(meterValues.apartmentTwo)
  );

  setText(
    "annexValue",
    formatNumber(meterValues.annex)
  );


  setText(
    "groundPercent",
    `${groundPercentage}٪ من الإجمالي`
  );

  setText(
    "apartmentOnePercent",
    `${apartmentOnePercentage}٪ من الإجمالي`
  );

  setText(
    "apartmentTwoPercent",
    `${apartmentTwoPercentage}٪ من الإجمالي`
  );

  setText(
    "annexPercent",
    `${annexPercentage}٪ من الإجمالي`
  );


  setProgress(
    "groundProgress",
    groundPercentage
  );

  setProgress(
    "apartmentOneProgress",
    apartmentOnePercentage
  );

  setProgress(
    "apartmentTwoProgress",
    apartmentTwoPercentage
  );

  setProgress(
    "annexProgress",
    annexPercentage
  );

  setProgress(
    "mainProgress",
    mainProgress
  );


  setText(
    "savingValue",
    `${formatNumber(saving)} ر.س`
  );

  updateSmartInsight();
}


function updateSmartInsight() {
  const meters = [
    {
      name: "الدور الأرضي",
      value: meterValues.ground
    },
    {
      name: "الشقة الأولى",
      value: meterValues.apartmentOne
    },
    {
      name: "الشقة الثانية",
      value: meterValues.apartmentTwo
    },
    {
      name: "الملحق",
      value: meterValues.annex
    }
  ];

  const highestMeter = meters.reduce(
    (highest, current) =>
      current.value > highest.value
        ? current
        : highest
  );

  const saving =
    Math.round(highestMeter.value * 0.1);

  setText(
    "insightTitle",
    `${highestMeter.name} يمثل أعلى جزء من الفاتورة.`
  );

  const insightText =
    document.getElementById("insightText");

  if (insightText) {
    insightText.innerHTML =
      `خفض استهلاكه 10٪ قد يوفر قرابة
      <strong>${formatNumber(saving)} ر.س</strong>
      شهريًا.`;
  }
}


function openEditor() {
  document.getElementById("groundInput").value =
    meterValues.ground;

  document.getElementById("apartmentOneInput").value =
    meterValues.apartmentOne;

  document.getElementById("apartmentTwoInput").value =
    meterValues.apartmentTwo;

  document.getElementById("annexInput").value =
    meterValues.annex;

  document
    .getElementById("editorModal")
    .classList.add("show");

  document.body.classList.add("modal-open");
}


function closeEditor() {
  document
    .getElementById("editorModal")
    .classList.remove("show");

  document.body.classList.remove("modal-open");
}


function getInputValue(id) {
  const input = document.getElementById(id);

  const value = Number(input.value);

  if (!Number.isFinite(value) || value < 0) {
    return 0;
  }

  return Math.round(value);
}


function saveValues() {
  meterValues = {
    ground: getInputValue("groundInput"),

    apartmentOne:
      getInputValue("apartmentOneInput"),

    apartmentTwo:
      getInputValue("apartmentTwoInput"),

    annex:
      getInputValue("annexInput")
  };

  saveToDevice();

  updateDashboard();

  closeEditor();

  showToast("تم حفظ القيم بنجاح");
}


function resetValues() {
  meterValues = { ...defaultValues };

  saveToDevice();

  updateDashboard();

  closeEditor();

  showToast("تم استرجاع القيم الأصلية");
}


function showToast(message) {
  const toast = document.getElementById("toast");

  toast.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}


document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeEditor();
  }
});


updateDashboard();
