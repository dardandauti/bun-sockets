# How can this work?

Sequentially:
[x] När jag fokuserar på ett element
[x] Greppa elementets ID
[ ] Sätt det ID:t i en lista över blockerade fält (Listan består av KV-par som är fältets ID som K, och användarens ID som V.)
[ ] Uppdatera UI för att visa att {användarID} redigerar atm.

Hur ska man då blockera en användare från att redigera?:

- Kolla om fältets id finns med i den blockerade listan -> kolla om användaren som vill fokusera på fältet är värdet för fältets nyckel.
- Vilken property ska trycka på att ej tillåta redigeringen.

- Det som ska kommuniceras fram och tillbaka är den blockerad-listan, sedan får frontend sköta resten av logiken.
