document.addEventListener("DOMContentLoaded", function() {
    fetch('/number').then(response => response.text()).then(data => {
        const numberInWords = numberToWords(data.trim());
        document.getElementById('numberInWords').innerText = numberInWords;
    });
});

function numberToWords(num) {
    const words = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
                   "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    if (num < 20) return words[num];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? " " + words[num % 10] : "");
    if (num < 1000) return words[Math.floor(num / 100)] + " Hundred" + (num % 100 !== 0 ? " " + numberToWords(num % 100) : "");
    return "Number too large";
}
