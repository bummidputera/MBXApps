export default [
    // type = LABEL | TEXT_INPUT | TEXT_AREA | MAP_VIEW | UPLOAD | SELECT_MULTIPLE | TIME_PICKER | AUTOFILL_ADDRESS
    // khusus type UPLOAD value dibuat multiple dengan validation uploadLimit, uploadMin
    // validation TEXT_INPUT        keyboardType = number-pad (phone number) | email-address | numeric
    // validation UPLOAD            uploadType = all | image | pdf | music
    // validation SELECT_MULTIPLE   selectType = form | tag
    // validation AUTOFILL_ADDRESS  fill_type = pin | full_address | province | city | suburb | area
    // {
    //     id: 0,
    //     order: 0,
    //     code: '',
    //     label: '',
    //     placeholder: '',
    //     hint_label: '',
    //     type: '',
    //     header_id: 1, // rujukan content akan tampil hanya pada header yang disematkan
    //     client_type: 'TRIBES_SURVEY_PASAR', // unique code record
    //     required: true, // true = wajib diisi | false = boleh skip
    //     options: [],
    //     default_value: null,
    //     validation: null,
    //     multiple: true, // content bisa masukan banyak value / array
    //     parent_code: null, // ref code
    //     branching_code: [], // list kode yang menjadi referensi content ini ditampilkan (status = 2)
    //     legacy_code: [],
    //     status: 1, 
                    // status yang tampil (1, 3)
                    // status tampil dengan kondisi (2)
                    // status yang dikirim (1, 2, 4)
                    // 0 = UNPUBLISH
                    // 1 = PUBLISH
                    // 2 = BRANCHING jika branching_code terdapat code yang di pilih pada value options sebelumnya
                    // 3 = MASTER tampil namun value tidak terkirim
                    // 4 = HIDDEN tidak tampil namun value terkirim
    // }
    {
        id: 1,
        order: 1,
        code: 'block_1_1',
        label: 'Informasi Responden / Penanggung Jawab Pasar',
        placeholder: '',
        hint_label: '',
        type: 'LABEL',
        header_id: 1,
        client_type: 'TRIBES_SURVEY_PASAR',
        required: false,
        options: [],
        default_value: null,
        validation: null,
        multiple: false,
        parent_code: null,
        branching_code: [],
        legacy_code: [],
        status: 1,
    },
    {
        id: 2,
        order: 2,
        code: 'block_1_2',
        label: 'Nama Responden',
        placeholder: 'Masukan nama lengkap',
        hint_label: '',
        type: 'TEXT_INPUT',
        header_id: 1,
        client_type: 'TRIBES_SURVEY_PASAR',
        required: true,
        options: [],
        // default_value: { ref: 'user', key: ['firstName', 'lastName'] },
        default_value: null,
        validation: null,
        multiple: false,
        parent_code: null,
        branching_code: [],
        legacy_code: [],
        status: 1,
    },
    {
        id: 3,
        order: 3,
        code: 'block_1_3',
        label: 'Nomor Telepon',
        placeholder: '81234567890',
        hint_label: '',
        type: 'TEXT_INPUT',
        header_id: 1,
        client_type: 'TRIBES_SURVEY_PASAR',
        required: true,
        options: [],
        // default_value: { ref: 'user', key: ['phoneNumber'] },
        default_value: null,
        validation: { keyboardType: 'number-pad', prefixText: '+62' },
        multiple: false,
        parent_code: null,
        branching_code: [],
        legacy_code: [],
        status: 1,
    },
    {
        id: 4,
        order: 4,
        code: 'block_1_4',
        label: 'Email',
        placeholder: 'Masukan email Anda',
        hint_label: '',
        type: 'TEXT_INPUT',
        header_id: 1,
        client_type: 'TRIBES_SURVEY_PASAR',
        required: true,
        options: [],
        // default_value: { ref: 'user', key: ['email'] },
        default_value: null,
        validation: { keyboardType: 'email-address' },
        multiple: false,
        parent_code: null,
        branching_code: [],
        legacy_code: [],
        status: 1,
    },
    {
        id: 5,
        order: 5,
        code: 'block_1_5',
        label: 'Informasi Petugas',
        placeholder: '',
        hint_label: '',
        type: 'LABEL',
        header_id: 1,
        client_type: 'TRIBES_SURVEY_PASAR',
        required: false,
        options: [],
        default_value: null,
        validation: null,
        multiple: false,
        parent_code: null,
        branching_code: [],
        legacy_code: [],
        status: 1,
    },
    {
        id: 6,
        order: 6,
        code: 'block_1_6',
        label: 'Nama Petugas',
        placeholder: 'Masukan nama petugas',
        hint_label: '',
        type: 'TEXT_INPUT',
        header_id: 1,
        client_type: 'TRIBES_SURVEY_PASAR',
        required: true,
        options: [],
        default_value: null,
        validation: null,
        multiple: false,
        parent_code: null,
        branching_code: [],
        legacy_code: [],
        status: 1,
    },
    {
        id: 7,
        order: 7,
        code: 'block_1_7',
        label: 'Nomor Telepon Petugas',
        placeholder: '81234567890',
        hint_label: '',
        type: 'TEXT_INPUT',
        header_id: 1,
        client_type: 'TRIBES_SURVEY_PASAR',
        required: true,
        options: [],
        default_value: null,
        validation: { keyboardType: 'number-pad', prefixText: '+62' },
        multiple: false,
        parent_code: null,
        branching_code: [],
        legacy_code: [],
        status: 1,
    },
    {
        id: 8,
        order: 8,
        code: 'block_1_8',
        label: 'Nama Koordinator Kab atau Kota',
        placeholder: 'Masukan nama koordinator',
        hint_label: '',
        type: 'TEXT_INPUT',
        header_id: 1,
        client_type: 'TRIBES_SURVEY_PASAR',
        required: true,
        options: [],
        default_value: null,
        validation: null,
        multiple: false,
        parent_code: null,
        branching_code: [],
        legacy_code: [],
        status: 1,
    },
    {
        id: 9,
        order: 9,
        code: 'block_1_9',
        label: 'Nomor Telepon Koordinator',
        placeholder: '81234567890',
        hint_label: '',
        type: 'TEXT_INPUT',
        header_id: 1,
        client_type: 'TRIBES_SURVEY_PASAR',
        required: true,
        options: [],
        default_value: null,
        validation: { keyboardType: 'number-pad', prefixText: '+62' },
        multiple: false,
        parent_code: null,
        branching_code: [],
        legacy_code: [],
        status: 1,
    },
    // {
    //     id: 10,
    //     order: 10,
    //     code: 'block_1_10',
    //     label: 'Koordinator tag',
    //     placeholder: '',
    //     hint_label: '',
    //     type: 'RADIO',
    //     header_id: 1,
    //     client_type: 'TRIBES_SURVEY_PASAR',
    //     required: true,
    //     options: [
    //         { id: 'hmi', name: 'HMI' },
    //         { id: 'fkppi', name: 'FKPPI' },
    //     ],
    //     default_value: null,
    //     validation: null,
    //     multiple: false,
    //     parent_code: null,
    //     branching_code: [],
    //     legacy_code: [],
    //     status: 1,
    // },
]