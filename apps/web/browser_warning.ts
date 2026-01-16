const userAgent = navigator.userAgent;
console.log(userAgent)
const isChromeBased = userAgent.toLowerCase().includes("chrom")
//console.log(isChromeBased)
if (!isChromeBased) {
    alert("Your browser might NOT support all features of this app.\nA chrome based browser like Chrome or Heluim is recommended.")
}