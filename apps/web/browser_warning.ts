const userAgent = navigator.userAgent;
console.log(userAgent)
const isChromeBased = userAgent.toLowerCase().includes("chrom")
//console.log(isChromeBased)
if (!isChromeBased) {
    alert("Your browser might not be supported.\nA chrome based browser like Chrome or Heluim is recommended.")
}