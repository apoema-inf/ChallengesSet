package br.ufg.inf.apoema.portal.Enums;

public enum ProfileEnum {
    SOLVER,
    DEMANDANTE;

    public static ProfileEnum getProfile(String profile) {
        switch (profile) {
            case "Demandante": return DEMANDANTE;
            case "Solucionadores": return SOLVER;
            default: return SOLVER;
        }
    }
}