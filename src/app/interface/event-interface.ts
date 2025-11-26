
export interface EventInterface {
    id?: number;
    nosaukums: string;
    apraksts: string;
    datums: Date;
    laiks: string;
    vieta: string;
    pasreizejaisDalibniekuSkaits: number[];
    maxDalibnieki: number;
    createdBy?: number;
}
