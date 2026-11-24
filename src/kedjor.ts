// Dag 7, del 1: Skriv om från then-kedjor till async/await.
// De här funktionerna fungerar redan, men använder .then(). Skriv om VARJE funktion till
// en async function med await (och try/catch där det behövs). Beteendet ska bli exakt
// detsamma, så testerna ska fortsätta vara gröna. Testerna kontrollerar också att
// funktionerna är async.
import { hamtaRattFranServer } from "./fordrojning";
import { formateraPris } from "./pris";

export async function hamtaRattPris(id: number): Promise<number> {
    const ratt = await hamtaRattFranServer(id, 10);

    return ratt.pris;
}

export async function hamtaRattPrisEllerNoll(id: number): Promise<number> {
  try {
    const ratt = await hamtaRattFranServer(id, 10);
    return ratt.pris;
  } 
  catch {
    return 0;
  }  
}

export async function hamtaOchFormatera(id: number): Promise<string> {
  const ratt = await hamtaRattFranServer(id, 10);

  return `${ratt.namn}: ${formateraPris(ratt.pris)}`;
}

export async function hamtaTvaPriser(id1: number, id2: number): Promise<number> {
  const rattNrOne = await hamtaRattFranServer(id1, 10);
  const rattNrTwo = await hamtaRattFranServer(id2, 10);
  
  return rattNrOne.pris + rattNrTwo.pris;
}
