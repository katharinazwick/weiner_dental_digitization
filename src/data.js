export const exemptFieldsWhenReparatur = ['shade', 'alloy', 'patientAge', 'patientGender'];

export const requestTypeOptions = [
    {value: 'neuantrag', label: 'Neuantrag'},
    {value: 'reparatur', label: 'Reparatur'},
];

export const orderTypes = [
    {value: 'regelversorgung', label: 'Regelversorgung'},
    {value: 'gleichartige', label: 'Gleichartige Versorgung'},
    {value: 'andersartige', label: 'Andersartige Versorgung'},
];

export const genderOptions = [
    {value: '', label: ''},
    {value: 'männlich', label: 'männlich'},
    {value: 'weiblich', label: 'weiblich'},
    {value: 'divers', label: 'divers'},
];

export const insuranceOptions = [
    {value: 'gesetzlich', label: 'gesetzlich versichert'},
    {value: 'privat', label: 'privat versichert'},
];

export const shadeOptions = [
    '', 'A1', 'A2', 'A3', 'A3.5', 'A4',
    'B1', 'B2', 'B3', 'B4',
    'C1', 'C2', 'C3', 'C4',
    'D2', 'D3', 'D4',
    'Bleach 1', 'Bleach 2'
].map(value => ({value, label: value}));

export const alloyOptions = [
    {value: '', label: ''},
    {value: 'CoCr', label: 'CoCr-Legierung'},
    {value: 'Gold', label: 'Hochgoldlegierung'},
    {value: 'Titan', label: 'Titan'},
    {value: 'Zirkon', label: 'Zirkonoxid'},
    {value: 'Keramik', label: 'Vollkeramik'},
    {value: 'PMMA', label: 'PMMA / Kunstoff'},
    {value: 'Hybrid', label: 'Hybridmaterial'},
];

export const toothFormOptions = [
    {value: '', label: ''},
    {value: 'leicht_ovalt', label: 'leicht oval'},
    {value: 'oval', label: 'oval'},
    {value: 'quadratisch', label: 'quadratisch'},
    {value: 'konisch', label: 'konisch'},
];

export const typeOptions = [
    {value: '', label: ''},
    {value: 'krone', label: 'Krone'},
    {value: 'bruecke', label: 'Brücke'},
    {value: 'teilprothese', label: 'Teilprothese'},
    {value: 'vollprothese', label: 'Vollprothese'},
    {value: 'implantat', label: 'Implantat'},
];

export const toothStatusOptions = [
    {value: 'ok', label: 'OK'},
    {value: 'krone', label: 'Krone'},
    {value: 'bruecke', label: 'Brücke'},
    {value: 'implantat', label: 'Implantat'},
    {value: 'fuellung', label: 'Füllung'},
    {value: 'veneers', label: 'Veneer'},
    {value: 'wurzelbehandelt', label: 'Wurzelb.'},
    {value: 'fehlend', label: 'fehlend'},
];

export const appointmentRows = [
    {id: 'auftragsdatum', label: 'Auftragsdatum', required: true},
    {id: 'fu_loeffel', label: 'FU-Löffel', required: false},
    {id: 'bissschablone', label: 'Bissschablone', required: false},
    {id: 'anprobe1', label: 'Anprobe 1', required: false},
    {id: 'anprobe2', label: 'Anprobe 2', required: false},
    {id: 'anprobe3', label: 'Anprobe 3', required: false},
    {id: 'fertigstellung', label: 'Fertigstellung', required: false},
];

export const dayOptions = [
    {value: '', label: ''},
    {value: 'mo', label: 'Mo'},
    {value: 'di', label: 'Di'},
    {value: 'mi', label: 'Mi'},
    {value: 'do', label: 'Do'},
    {value: 'fr', label: 'Fr'},
    {value: 'sa', label: 'Sa'},
];

export const timeOptions = Array.from({ length: 21 }, (_, i) => {
    const totalMinutes = 8 * 60 + i * 30;
    const hh = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
    const mm = totalMinutes % 60 === 0 ? '00' : '30';
    return { value: `${hh}:${mm}`, label: `${hh}:${mm}` };
});

export const toothNumbers = {
    upperRight: ['18', '17', '16', '15', '14', '13', '12', '11'],
    upperLeft: ['21', '22', '23', '24', '25', '26', '27', '28'],
    lowerRight: ['48', '47', '46', '45', '44', '43', '42', '41'],
    lowerLeft: ['31', '32', '33', '34', '35', '36', '37', '38'],
};

export const toothDefaultStatus = 'ok';

export const defaultValues = {
    requestType: 'neuantrag',
    orderType: 'regelversorgung',
    patientFirstName: 'Vorname',
    patientSecondName: 'Nachname',
    dentistName: 'Dr. med. dent. Nachname',
    practiceName: 'Praxis am Park',
    dentistAddress: 'Musterstraße 12, 14482 Potsdam',
    practiceEmail   :'Nachname@email.com',
    patientAge: '34',
    patientGender: 'männlich',
    insurance: 'gesetzlich',
    xmlNumber: 'XML-2026-0421',
    shade: 'A2',
    alloy: 'CoCr',
    type: 'krone',
    contractService: 'Keramikverblendete Krone im Seitenzahnbereich',
    privateService: 'Individuelle Farbabstimmung und Hochglanzpolitur',
    phoneNote: 'Bitte vor Rückfragen kurz telefonisch melden.',
    deliveredWith: 'Abdruck, Bissregistrat und Farbfoto',
    completionNote: 'Fertigstellung nach Rücksprache',
    auftragsdatum_day: new Date().toISOString().split('T')[0],
};