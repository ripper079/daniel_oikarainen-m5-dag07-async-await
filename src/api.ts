// Dag 7, del 2: Skriv egna async-funktioner. Gör testerna gröna på tests.html.
// Alla funktioner ska vara async och använda await. Använd INTE .then().
import { hamtaMenyFranServer, hamtaRattFranServer } from "./fordrojning";
import type { Ratt, Tillstand } from "./typer";

// 1. Hämta hela menyn (använd hamtaMenyFranServer med 10 ms). Returnerar menyn.
export async function hamtaMeny(): Promise<Ratt[]> {
  // TODO
  return await hamtaMenyFranServer(10);
}

// 2. Hämta namnet på en rätt (hamtaRattFranServer(id, 10)). Okänt id: låt felet följa med (fånga det inte).
export async function hamtaRattNamn(id: number): Promise<string> {
  // TODO
  const ratt = await hamtaRattFranServer(id, 10);
  return ratt.namn;
}

// 3. Som 2, men om något går fel returnerar funktionen null istället för att kasta fel (try/catch).
export async function hamtaRattEllerNull(id: number): Promise<Ratt | null> {
  // TODO
  try {
    return await hamtaRattFranServer(id, 10);
  }
  catch {
    return null;
  }
}

//Kommentar 4 och 5
// Parallelt: Båda anropen startas direkt och väntar samtidigt
// Så teoretiskt borde den vara dubbelt så snabb

// 4. Hämta två rätter EFTER varandra (await, sedan await). Returnerar [ratt1, ratt2]. ms är väntetiden per anrop.
export async function hamtaTvaRatterEfterVarandra(id1: number, id2: number, ms: number = 100): Promise<Ratt[]> {
  // TODO
  const rattEtt = await hamtaRattFranServer(id1, ms);
  const rattTva = await hamtaRattFranServer(id2, ms);

  return [rattEtt, rattTva];
}

// 5. Samma sak, men båda ANROPEN startas samtidigt (Promise.all). Ska gå dubbelt så snabbt.
export async function hamtaTvaRatterParallellt(id1: number, id2: number, ms: number = 100): Promise<Ratt[]> {
  // TODO

  return await Promise.all([
    hamtaRattFranServer(id1, ms),
    hamtaRattFranServer(id2, ms),
  ]);
}

// 6. Försök upp till maxForsok gånger. anropFn är en funktion som returnerar en promise.
//    Lyckas något försök: returnera resultatet. Misslyckas alla: kasta det SISTA felet.
//    Tips: en for-loop med try/catch inuti, och spara det senaste felet i en variabel.
export async function hamtaMedForsok<T>(anropFn: () => Promise<T>, maxForsok: number): Promise<T> {
  // TODO
  let felet;
  for (let i = 0; i < maxForsok; i++) {
    try {
      return await anropFn();
    } 
    catch (errorObject) {
      felet = errorObject;
    }
  }
  throw felet;
}

// 7. Ge en promise en tidsgräns. Är den inte klar inom ms millisekunder: avvisa med
//    new Error("Tidsgränsen överskreds"). Tips: Promise.race med en promise som avvisas efter ms.
export function medTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  // TODO
  const tidMaxGrans = new Promise<never>((resolve, reject) => {
    setTimeout(() => reject(new Error("Tidsgränsen överskreds")), ms);
  });
  // Den som blir klar först vinner
  return Promise.race([promise, tidMaxGrans]);
}

// 8. Tillståndsmaskinen för att ladda något: laddar -> klar / tomt / fel.
//    hamtaFn returnerar en promise med en lista. vidTillstand anropas med ett objekt:
//      { typ: "laddar" }                       först av allt
//      { typ: "klar", ratter: [...] }          om listan har innehåll
//      { typ: "tomt" }                         om listan är tom
//      { typ: "fel", meddelande: "..." }       om hamtaFn misslyckas (felets message)
export async function laddaMeny(hamtaFn: () => Promise<Ratt[]>, vidTillstand: (tillstand: Tillstand) => void): Promise<void> {
  // TODO
  vidTillstand({ typ: "laddar" });

  try {
    // Vänta tills listan är hämtad
    const ratter = await hamtaFn();

    // Är listan tom
    if (ratter.length === 0) {
      vidTillstand({ typ: "tomt" });
    } else {
      vidTillstand({ typ: "klar", ratter });
    }
  }
  //Hanterar Fel
  catch (errorObject) {
    // Kolla typ och spara fel meddelande
    const meddelande = errorObject instanceof Error ? errorObject.message : String(errorObject);
    vidTillstand({ typ: "fel", meddelande });
  }
  
}
