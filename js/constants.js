const RECOGNITION_RESTART_DELAY_MS = 100;

const TITLE_IDLE       = 'Speech to Text — Live';
const TITLE_LIVE       = '● LIVE · Speech to Text — GSKI Rehobot Surabaya';
const PLACEHOLDER_IDLE = 'Klik <b>▶ Mulai</b> untuk memulai transkripsi…';
const PLACEHOLDER_LIVE = 'Mulai berbicara…';

const HISTORY_FADE_DARK  = [1, 0.5, 0.28, 0.13];
const HISTORY_FADE_LIGHT = [1, 0.6, 0.38, 0.25];

const BIBLE_BOOKS = [
    'Kisah Para Rasul', 'Kidung Agung', 'Hakim-hakim',
    '1 Raja-raja', '2 Raja-raja', 'Raja-raja',
    '1 Tawarikh',  '2 Tawarikh',  'Tawarikh',
    '1 Tesalonika','2 Tesalonika', 'Tesalonika',
    '1 Timotius',  '2 Timotius',  'Timotius',
    '1 Korintus',  '2 Korintus',  'Korintus',
    '1 Samuel',    '2 Samuel',    'Samuel',
    '1 Yohanes',   '2 Yohanes',   '3 Yohanes',
    '1 Petrus',    '2 Petrus',    'Petrus',
    'Kejadian', 'Keluaran', 'Imamat',  'Bilangan', 'Ulangan',
    'Yosua', 'Rut', 'Ezra', 'Nehemia', 'Ester', 'Ayub',
    'Mazmur', 'Amsal', 'Pengkhotbah',
    'Yesaya', 'Yeremia', 'Ratapan', 'Yehezkiel', 'Daniel',
    'Hosea', 'Yoel', 'Amos', 'Obaja', 'Yunus', 'Mikha',
    'Nahum', 'Habakuk', 'Zefanya', 'Hagai', 'Zakharia', 'Maleakhi',
    'Matius', 'Markus', 'Lukas', 'Yohanes', 'Roma',
    'Galatia', 'Efesus', 'Filipi', 'Kolose', 'Titus', 'Filemon',
    'Ibrani', 'Yakobus', 'Yudas', 'Wahyu',
];

const NUMWORD_PAT = [
    'dua puluh sembilan', 'dua puluh delapan', 'dua puluh tujuh', 'dua puluh enam',
    'dua puluh lima', 'dua puluh empat', 'dua puluh tiga', 'dua puluh dua', 'dua puluh satu',
    'tiga puluh', 'dua puluh', 'sembilan belas', 'delapan belas', 'tujuh belas', 'enam belas',
    'lima belas', 'empat belas', 'tiga belas', 'dua belas', 'sebelas',
    'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh',
].map(w => w.replace(/ /g, '\\s+')).join('|');

const NUM_PAT = `(?:(?:yang\\s+)?ke[-\\s]?)?(?:\\d+|${NUMWORD_PAT})`;

const WORD_NUM_MAP = {
    'satu': '1', 'dua': '2', 'tiga': '3', 'empat': '4', 'lima': '5',
    'enam': '6', 'tujuh': '7', 'delapan': '8', 'sembilan': '9', 'sepuluh': '10',
    'sebelas': '11', 'dua belas': '12', 'tiga belas': '13', 'empat belas': '14',
    'lima belas': '15', 'enam belas': '16', 'tujuh belas': '17', 'delapan belas': '18',
    'sembilan belas': '19', 'dua puluh': '20', 'dua puluh satu': '21', 'dua puluh dua': '22',
    'dua puluh tiga': '23', 'dua puluh empat': '24', 'dua puluh lima': '25',
    'dua puluh enam': '26', 'dua puluh tujuh': '27', 'dua puluh delapan': '28',
    'dua puluh sembilan': '29', 'tiga puluh': '30',
};
