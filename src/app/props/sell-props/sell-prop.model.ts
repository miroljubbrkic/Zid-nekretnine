
// export interface SellProp {
//     _id: string
//     tip: string
//     povrsina: number
//     cenaKvadrata: number
//     struktura: string
//     sprat: number
//     brojSpavacihSoba: number,
//     slike: string[],
//     opis: string,
//     agent: string
// }

export interface SellProp {
    _id: string;
    naslov: string;
    tip: string;
    struktura: string;
    grad: string;
    naselje: string;
    adresa: string;
    povrsina: number;
    cena: number;
    spratovi: number; 
    sprat: number;
    lift: boolean;
    grejanje: string;
    namestenost: boolean;
    uknjizenost: boolean;
    slike: string[];
    opis: string;
    agent: string;
}
