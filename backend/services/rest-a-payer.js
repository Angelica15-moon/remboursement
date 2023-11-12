export function calculRestAPayer(soldeEncours, remboursement) {
    if (soldeEncours && remboursement) {
        return soldeEncours - remboursement;
    }
    return soldeEncours;
}