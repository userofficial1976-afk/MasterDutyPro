```javascript
/* =====================================================
   MASTER DUTY PRO
   KOD TEMPAT KERJA
   VERSI PENUH — MULTI POS
   DATABASE ASAL DIKEKALKAN
===================================================== */


/* =====================================================
   SUPABASE
===================================================== */

const SUPABASE_URL =
    "https://nlwrrrwkjpktrifxeymw.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_0ymP9thOFXkuNYzvwa0gwQ_1mbxyFE6";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


console.log(
    "SUPABASE CONNECTED - KOD TEMPAT KERJA"
);


/* =====================================================
   DATABASE TABLE
===================================================== */

const TABLE_TEMPAT_KERJA =
    "kod_tempat_kerja";

const TABLE_ANGGOTA =
    "Data_Anggota";


/* =====================================================
   GLOBAL
===================================================== */

let posDipilih = [];

let dataTempatKerja = [];

let idSedangEdit = null;


/* =====================================================
   USER LOGIN
===================================================== */

let pengguna = null;


/* =====================================================
   INIT
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        console.log(
            "KOD TEMPAT KERJA JS READY"
        );


        /* =============================================
           SEMAK LOGIN
        ============================================= */

        pengguna =
            bacaPengguna();


        if (!pengguna) {

            window.location.href =
                "login.html";

            return;

        }


        paparMaklumatPengguna();


        /* =============================================
           LOAD AWAL
        ============================================= */

        paparPosDipilih();


        await muatkanPos();


        await muatkanTempatKerja();


        /* =============================================
           EVENT UNIT
        ============================================= */

        const unit =
            document.getElementById(
                "unit"
            );


        if (unit) {

            unit.addEventListener(
                "change",
                function () {

                    /*
                       Apabila Unit berubah,
                       POS yang dipilih dibersihkan.
                    */

                    posDipilih = [];

                    paparPosDipilih();

                    muatkanPos();

                }
            );

        }


        /* =============================================
           FILTER UNIT
        ============================================= */

        const filterUnit =
            document.getElementById(
                "filterUnit"
            );


        if (filterUnit) {

            filterUnit.addEventListener(
                "change",
                function () {

                    muatkanTempatKerja();

                }
            );

        }


        /* =============================================
           ENTER PADA KOD TK
        ============================================= */

        const kod =
            document.getElementById(
                "kodTempatKerja"
            );


        if (kod) {

            kod.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter"
                    ) {

                        event.preventDefault();

                        simpanTempatKerja();

                    }

                }
            );

        }

    }
);


/* =====================================================
   BACA USER LOCAL STORAGE
===================================================== */

function bacaPengguna() {

    try {

        const data =
            localStorage.getItem(
                "mdp_user"
            );


        if (!data) {

            return null;

        }


        return JSON.parse(
            data
        );

    }

    catch (error) {

        console.error(
            "Gagal membaca mdp_user:",
            error
        );

        return null;

    }

}


/* =====================================================
   PAPAR USER
===================================================== */

function paparMaklumatPengguna() {

    if (!pengguna) {

        return;

    }


    const nama =
        pengguna.name ||
        pengguna.nama ||
        pengguna.noSkb ||
        "Pengguna";


    const jawatan =
        pengguna.jawatan ||
        "Pengguna";


    const userName =
        document.getElementById(
            "userName"
        );


    const userJawatan =
        document.getElementById(
            "userJawatan"
        );


    const userAvatar =
        document.getElementById(
            "userAvatar"
        );


    if (userName) {

        userName.textContent =
            nama;

    }


    if (userJawatan) {

        userJawatan.textContent =
            jawatan;

    }


    if (userAvatar) {

        userAvatar.textContent =
            String(
                nama
            )
            .trim()
            .charAt(0)
            .toUpperCase();

    }


    /*
       Menu admin.

       Login asal menggunakan:
       isAdmin = true
       untuk PTW / PPOW / POW
    */

    if (
        pengguna.isAdmin !== true
    ) {

        const menuLaporan =
            document.getElementById(
                "menuLaporan"
            );

        const menuTetapan =
            document.getElementById(
                "menuTetapan"
            );


        if (menuLaporan) {

            menuLaporan.style.display =
                "none";

        }


        if (menuTetapan) {

            menuTetapan.style.display =
                "none";

        }

    }

}


/* =====================================================
   LOG KELUAR
===================================================== */

function logKeluar() {

    try {

        localStorage.removeItem(
            "mdp_user"
        );

    }

    catch (error) {

        console.error(
            "Gagal log keluar:",
            error
        );

    }

}


/* =====================================================
   LOAD SENARAI POS
   SUMBER:
   Data_Anggota.pos
===================================================== */

async function muatkanPos() {

    const dropdown =
        document.getElementById(
            "pos"
        );


    if (!dropdown) {

        return;

    }


    dropdown.innerHTML = `
        <option value="">
            Sedang memuatkan Pos...
        </option>
    `;


    try {

        const {
            data,
            error
        } =
            await supabaseClient

                .from(
                    TABLE_ANGGOTA
                )

                .select(
                    "pos"
                );


        if (error) {

            throw error;

        }


        /*
           Ambil POS unik
        */

        const senaraiPos =

            [
                ...new Set(

                    (data || [])

                        .map(
                            row =>
                                row.pos
                        )

                        .filter(
                            pos =>

                                pos !== null &&

                                pos !== undefined &&

                                String(
                                    pos
                                )
                                .trim() !== ""
                        )

                        .map(
                            pos =>
                                String(
                                    pos
                                )
                                .trim()
                        )

                )
            ];


        /*
           Susun ikut abjad
        */

        senaraiPos.sort(
            function (a, b) {

                return a.localeCompare(
                    b,
                    "ms"
                );

            }
        );


        dropdown.innerHTML = `
            <option value="">
                -- Pilih Pos --
            </option>
        `;


        senaraiPos.forEach(
            function (pos) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    pos;


                option.textContent =
                    pos;


                dropdown.appendChild(
                    option
                );

            }
        );


        console.log(
            "SENARAI POS:",
            senaraiPos
        );

    }

    catch (error) {

        console.error(
            "Gagal memuatkan Pos:",
            error
        );


        dropdown.innerHTML = `
            <option value="">
                Gagal memuatkan Pos
            </option>
        `;


        paparkanMesej(
            "Gagal memuatkan Pos: " +
            error.message,
            "error"
        );

    }

}


/* =====================================================
   TAMBAH POS
===================================================== */

function tambahPos() {

    const dropdown =
        document.getElementById(
            "pos"
        );


    if (!dropdown) {

        return;

    }


    const pos =
        dropdown.value.trim();


    if (!pos) {

        paparkanMesej(
            "Sila pilih Pos dahulu.",
            "error"
        );

        return;

    }


    if (
        posDipilih.includes(
            pos
        )
    ) {

        paparkanMesej(
            "Pos tersebut telah dipilih.",
            "error"
        );

        return;

    }


    posDipilih.push(
        pos
    );


    paparPosDipilih();


    dropdown.value = "";


    paparkanMesej(
        "Pos berjaya ditambah.",
        "success"
    );

}


/* =====================================================
   BUANG POS
===================================================== */

function buangPos(
    index
) {

    if (
        index < 0 ||
        index >= posDipilih.length
    ) {

        return;

    }


    posDipilih.splice(
        index,
        1
    );


    paparPosDipilih();

}


/* =====================================================
   PAPAR POS DIPILIH
===================================================== */

function paparPosDipilih() {

    const container =
        document.getElementById(
            "posDipilih"
        );


    if (!container) {

        return;

    }


    if (
        posDipilih.length === 0
    ) {

        container.innerHTML = `
            <span class="empty-pos">
                Belum ada Pos dipilih
            </span>
        `;

        return;

    }


    container.innerHTML =

        posDipilih

            .map(
                function (
                    pos,
                    index
                ) {

                    return `
                        <span
                            class="pos-tag"
                        >

                            ${escapeHTML(
                                pos
                            )}

                            <button
                                type="button"
                                onclick="buangPos(${index})"
                                title="Buang Pos"
                            >
                                ×
                            </button>

                        </span>
                    `;

                }
            )

            .join("");

}


/* =====================================================
   SIMPAN / UPDATE
===================================================== */

async function simpanTempatKerja() {

    const unitElement =
        document.getElementById(
            "unit"
        );


    const kodElement =
        document.getElementById(
            "kodTempatKerja"
        );


    if (
        !unitElement ||
        !kodElement
    ) {

        return;

    }


    const unit =
        unitElement.value
            .trim();


    const kodTK =
        kodElement.value
            .trim()
            .toUpperCase();


    /* =============================================
       VALIDASI UNIT
    ============================================= */

    if (!unit) {

        paparkanMesej(
            "Sila pilih Unit.",
            "error"
        );

        unitElement.focus();

        return;

    }


    /* =============================================
       VALIDASI KOD
    ============================================= */

    if (!kodTK) {

        paparkanMesej(
            "Sila masukkan Kod TK.",
            "error"
        );

        kodElement.focus();

        return;

    }


    /* =============================================
       VALIDASI POS
    ============================================= */

    if (
        posDipilih.length === 0
    ) {

        paparkanMesej(
            "Sila pilih sekurang-kurangnya satu Pos.",
            "error"
        );

        return;

    }


    /*
       Contoh:

       posDipilih:
       [
           "Pos A",
           "Pos B"
       ]

       Database:

       nama_tempat_kerja =
       "Pos A & Pos B"
    */

    const namaTempatKerja =
        posDipilih.join(
            " & "
        );


    try {

        setLoadingSimpan(
            true
        );


        /* =============================================
           SEMAK DUPLICATE
        ============================================= */

        let querySemak =

            supabaseClient

                .from(
                    TABLE_TEMPAT_KERJA
                )

                .select(
                    "id"
                )

                .eq(
                    "unit",
                    unit
                )

                .eq(
                    "kod_tempat_kerja",
                    kodTK
                );


        /*
           Semasa EDIT,
           jangan bandingkan dengan rekod
           yang sedang diedit.
        */

        if (
            idSedangEdit !== null &&
            idSedangEdit !== undefined
        ) {

            querySemak =
                querySemak.neq(
                    "id",
                    idSedangEdit
                );

        }


        const {
            data: semakan,
            error: errorSemakan
        } = await querySemak;


        if (errorSemakan) {

            throw errorSemakan;

        }


        if (
            semakan &&
            semakan.length > 0
        ) {

            paparkanMesej(
                "Kod TK tersebut sudah wujud untuk Unit ini.",
                "error"
            );

            return;

        }


        /* =============================================
           DATA DATABASE ASAL
        ============================================= */

        const rekod = {

            unit:
                unit,

            kod_tempat_kerja:
                kodTK,

            nama_tempat_kerja:
                namaTempatKerja,

            status:
                "Aktif"

        };


        console.log(
            "REKOD SIMPAN:",
            rekod
        );


        let response;


        /* =============================================
           UPDATE
        ============================================= */

        if (
            idSedangEdit !== null &&
            idSedangEdit !== undefined
        ) {

            response =

                await supabaseClient

                    .from(
                        TABLE_TEMPAT_KERJA
                    )

                    .update(
                        rekod
                    )

                    .eq(
                        "id",
                        idSedangEdit
                    );

        }

        /* =============================================
           INSERT
        ============================================= */

        else {

            response =

                await supabaseClient

                    .from(
                        TABLE_TEMPAT_KERJA
                    )

                    .insert(
                        [
                            rekod
                        ]
                    );

        }


        if (
            response.error
        ) {

            throw response.error;

        }


        const sedangEdit =
            idSedangEdit !== null &&
            idSedangEdit !== undefined;


        paparkanMesej(
            sedangEdit
                ? "Kod Tempat Kerja berjaya dikemaskini."
                : "Kod Tempat Kerja berjaya disimpan.",
            "success"
        );


        resetBorang();


        await muatkanTempatKerja();

    }

    catch (error) {

        console.error(
            "RALAT SIMPAN:",
            error
        );


        paparkanMesej(
            "Gagal simpan data: " +
            (
                error.message ||
                "Ralat tidak diketahui."
            ),
            "error"
        );

    }

    finally {

        setLoadingSimpan(
            false
        );

    }

}


/* =====================================================
   LOAD DATA KOD TEMPAT KERJA
===================================================== */

async function muatkanTempatKerja() {

    const tbody =
        document.getElementById(
            "senaraiTempatKerja"
        );


    if (!tbody) {

        return;

    }


    tbody.innerHTML = `
        <tr>
            <td
                colspan="6"
                class="loading-cell"
            >
                <i class="fa-solid fa-spinner fa-spin"></i>
                &nbsp; Sedang memuatkan data...
            </td>
        </tr>
    `;


    try {

        const filterUnit =
            document.getElementById(
                "filterUnit"
            )?.value || "";


        let query =

            supabaseClient

                .from(
                    TABLE_TEMPAT_KERJA
                )

                .select(`
                    id,
                    unit,
                    kod_tempat_kerja,
                    nama_tempat_kerja,
                    status
                `);


        if (filterUnit) {

            query =
                query.eq(
                    "unit",
                    filterUnit
                );

        }


        const {
            data,
            error
        } = await query

            .order(
                "unit",
                {
                    ascending: true
                }
            )

            .order(
                "kod_tempat_kerja",
                {
                    ascending: true
                }
            );


        if (error) {

            throw error;

        }


        dataTempatKerja =
            data || [];


        console.log(
            "DATA KOD TEMPAT KERJA:",
            dataTempatKerja
        );


        paparSenaraiTempatKerja();

    }

    catch (error) {

        console.error(
            "Gagal memuatkan data:",
            error
        );


        tbody.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    class="error-cell"
                >
                    Gagal memuatkan data:
                    ${escapeHTML(
                        error.message
                    )}
                </td>
            </tr>
        `;

    }

}


/* =====================================================
   PAPAR TABLE
===================================================== */

function paparSenaraiTempatKerja() {

    const tbody =
        document.getElementById(
            "senaraiTempatKerja"
        );


    if (!tbody) {

        return;

    }


    if (
        dataTempatKerja.length === 0
    ) {

        tbody.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    class="empty-cell"
                >
                    <i class="fa-solid fa-inbox"></i>
                    <br>
                    Tiada Kod Tempat Kerja direkodkan.
                </td>
            </tr>
        `;

        return;

    }


    tbody.innerHTML =

        dataTempatKerja

            .map(
                function (
                    item,
                    index
                ) {

                    const status =
                        item.status ||
                        "Aktif";


                    const statusLower =
                        String(
                            status
                        )
                        .trim()
                        .toLowerCase();


                    const kelasStatus =

                        statusLower ===
                        "aktif"

                            ?

                            "badge-aktif"

                            :

                            "badge-tidak-aktif";


                    return `
                        <tr>

                            <td class="bil">
                                ${index + 1}
                            </td>


                            <td>
                                ${escapeHTML(
                                    item.unit
                                )}
                            </td>


                            <td class="kod-cell">
                                ${escapeHTML(
                                    item.kod_tempat_kerja
                                )}
                            </td>


                            <td class="pos-cell">
                                ${escapeHTML(
                                    item.nama_tempat_kerja
                                )}
                            </td>


                            <td>

                                <span
                                    class="badge ${kelasStatus}"
                                >
                                    ${escapeHTML(
                                        status
                                    )}
                                </span>

                            </td>


                            <td>

                                <div class="actions">

                                    <button
                                        type="button"
                                        class="btn-edit"
                                        onclick="editTempatKerja('${escapeJS(
                                            item.id
                                        )}')"
                                    >
                                        <i class="fa-solid fa-pen"></i>
                                        Edit
                                    </button>


                                    <button
                                        type="button"
                                        class="btn-danger"
                                        onclick="padamTempatKerja('${escapeJS(
                                            item.id
                                        )}')"
                                    >
                                        <i class="fa-solid fa-trash"></i>
                                        Padam
                                    </button>

                                </div>

                            </td>

                        </tr>
                    `;

                }
            )

            .join("");

}


/* =====================================================
   EDIT
===================================================== */

async function editTempatKerja(
    id
) {

    const item =
        dataTempatKerja.find(
            function (row) {

                return String(
                    row.id
                ) === String(
                    id
                );

            }
        );


    if (!item) {

        paparkanMesej(
            "Data Kod TK tidak dijumpai.",
            "error"
        );

        return;

    }


    /* =============================================
       SET ID EDIT
    ============================================= */

    idSedangEdit =
        item.id;


    /* =============================================
       SET UNIT
    ============================================= */

    const unit =
        document.getElementById(
            "unit"
        );


    if (unit) {

        unit.value =
            item.unit || "";

    }


    /* =============================================
       SET KOD TK
    ============================================= */

    const kod =
        document.getElementById(
            "kodTempatKerja"
        );


    if (kod) {

        kod.value =
            item.kod_tempat_kerja || "";

    }


    /* =============================================
       BACA MULTI POS
    ============================================= */

    posDipilih =

        String(
            item.nama_tempat_kerja ||
            ""
        )

        .split(
            "&"
        )

        .map(
            function (pos) {

                return pos.trim();

            }
        )

        .filter(
            Boolean
        );


    paparPosDipilih();


    /* =============================================
       LOAD POS DROPDOWN
    ============================================= */

    await muatkanPos();


    /* =============================================
       UI EDIT
    ============================================= */

    const tajuk =
        document.getElementById(
            "tajukBorang"
        );


    if (tajuk) {

        tajuk.textContent =
            "Edit Kod Tempat Kerja";

    }


    const btn =
        document.getElementById(
            "btnSimpan"
        );


    if (btn) {

        btn.innerHTML =
            `
                <i class="fa-solid fa-floppy-disk"></i>
                KEMASKINI
            `;

    }


    paparkanMesej(
        "Mod edit aktif. Ubah data dan klik KEMASKINI.",
        "success"
    );


    /* =============================================
       SCROLL KE BORANG
    ============================================= */

    window.scrollTo(
        {
            top: 0,
            behavior: "smooth"
        }
    );


    setTimeout(
        function () {

            if (unit) {

                unit.focus();

            }

        },
        300
    );

}


/* =====================================================
   PADAM
===================================================== */

async function padamTempatKerja(
    id
) {

    const item =
        dataTempatKerja.find(
            function (row) {

                return String(
                    row.id
                ) === String(
                    id
                );

            }
        );


    if (!item) {

        return;

    }


    const sah =

        confirm(
            "Padam Kod TK " +
            item.kod_tempat_kerja +
            " untuk Unit " +
            item.unit +
            "?"
        );


    if (!sah) {

        return;

    }


    try {

        const {
            error
        } = await supabaseClient

            .from(
                TABLE_TEMPAT_KERJA
            )

            .delete()

            .eq(
                "id",
                id
            );


        if (error) {

            throw error;

        }


        /*
           Jika sedang edit rekod yang dipadam,
           reset dahulu.
        */

        if (
            idSedangEdit !== null &&
            String(
                idSedangEdit
            ) === String(
                id
            )
        ) {

            resetBorang();

        }


        paparkanMesej(
            "Data berjaya dipadam.",
            "success"
        );


        await muatkanTempatKerja();

    }

    catch (error) {

        console.error(
            "RALAT PADAM:",
            error
        );


        paparkanMesej(
            "Gagal padam data: " +
            (
                error.message ||
                "Ralat tidak diketahui."
            ),
            "error"
        );

    }

}


/* =====================================================
   RESET BORANG
===================================================== */

function resetBorang() {

    idSedangEdit =
        null;


    posDipilih =
        [];


    const unit =
        document.getElementById(
            "unit"
        );


    const kod =
        document.getElementById(
            "kodTempatKerja"
        );


    const pos =
        document.getElementById(
            "pos"
        );


    const tajuk =
        document.getElementById(
            "tajukBorang"
        );


    const btn =
        document.getElementById(
            "btnSimpan"
        );


    if (unit) {

        unit.value =
            "";

    }


    if (kod) {

        kod.value =
            "";

    }


    if (pos) {

        pos.value =
            "";

    }


    if (tajuk) {

        tajuk.textContent =
            "Tambah Kod Tempat Kerja";

    }


    if (btn) {

        btn.innerHTML =
            `
                <i class="fa-solid fa-floppy-disk"></i>
                SIMPAN
            `;

    }


    paparPosDipilih();

}


/* =====================================================
   LOADING BUTTON
===================================================== */

function setLoadingSimpan(
    loading
) {

    const btn =
        document.getElementById(
            "btnSimpan"
        );


    if (!btn) {

        return;

    }


    if (loading) {

        btn.disabled =
            true;

        btn.style.opacity =
            "0.65";

        btn.style.cursor =
            "not-allowed";


        btn.innerHTML =
            `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Menyimpan...
            `;

    }

    else {

        btn.disabled =
            false;

        btn.style.opacity =
            "";

        btn.style.cursor =
            "";


        if (
            idSedangEdit !== null &&
            idSedangEdit !== undefined
        ) {

            btn.innerHTML =
                `
                    <i class="fa-solid fa-floppy-disk"></i>
                    KEMASKINI
                `;

        }

        else {

            btn.innerHTML =
                `
                    <i class="fa-solid fa-floppy-disk"></i>
                    SIMPAN
                `;

        }

    }

}


/* =====================================================
   MESSAGE
===================================================== */

function paparkanMesej(
    mesej,
    jenis
) {

    const div =
        document.getElementById(
            "mesej"
        );


    if (!div) {

        return;

    }


    div.className =
        jenis || "";


    div.textContent =
        mesej;


    div.style.display =
        "block";


    /*
       Success hilang automatik.
       Error kekal supaya mudah dibaca.
    */

    if (
        jenis === "success"
    ) {

        clearTimeout(
            window.timerMesej
        );


        window.timerMesej =
            setTimeout(
                function () {

                    div.style.display =
                        "none";

                },
                4500
            );

    }

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(
        value
    )

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =====================================================
   ESCAPE JAVASCRIPT
===================================================== */

function escapeJS(
    value
) {

    return String(
        value
    )

        .replace(
            /\\/g,
            "\\\\"
        )

        .replace(
            /'/g,
            "\\'"
        )

        .replace(
            /"/g,
            '\\"'
        )

        .replace(
            /\r?\n/g,
            "\\n"
        );

}
```
