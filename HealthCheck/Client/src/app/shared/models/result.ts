import { ICheck } from "./check";

export interface IResult {
    checks: ICheck[];
    totalStatus: string;
    totalResponseTime: number;
}