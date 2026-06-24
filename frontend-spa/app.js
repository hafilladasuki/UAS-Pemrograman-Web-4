const { createApp } = Vue;

createApp({
    data() {
        return {
            isLoggedIn: false,
            loading: false,
            errorMsg: '',
            loginForm: {
                email: '',
                password: ''
            },
            listPengaduan: [],
            apiUrl: 'http://localhost:8080/api'
        }
    },
    mounted() {
        // Cek apakah admin sudah pernah login sebelumnya
        const savedLogin = localStorage.getItem('isLoggedIn');
        const token = localStorage.getItem('token');
        if (savedLogin === 'true' && token) {
            this.isLoggedIn = true;
            this.loadData();
        }
    },
    methods: {
        // ==========================================
        // PROSES LOGIN
        // ==========================================
        async handleLogin() {
            this.loading = true;
            this.errorMsg = '';
            try {
                const response = await axios.post(`${this.apiUrl}/login`, {
                    email: this.loginForm.email,
                    password: this.loginForm.password
                });

                // Membaca token response dari Backend
                if (response.status === 200 || response.data.token) {
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('token', response.data.token);
                    
                    this.isLoggedIn = true;
                    this.loadData();
                } else {
                    this.errorMsg = 'Kombinasi akun salah atau tidak terdaftar!';
                }
            } catch (error) {
                console.error(error);
                this.errorMsg = 'Koneksi ke backend gagal! Pastikan php spark serve aktif.';
            } finally {
                this.loading = false;
            }
        },

        // ==========================================
        // AMBIL DATA DARI PHPMYADMIN
        // ==========================================
        async loadData() {
            this.loading = true;
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${this.apiUrl}/pengaduan`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                // Cek kecocokan parsing data array dari database
                if (response.data && response.data.data) {
                    this.listPengaduan = response.data.data;
                } else if (Array.isArray(response.data)) {
                    this.listPengaduan = response.data;
                }
            } catch (error) {
                console.error("Gagal memuat aduan database:", error);
            } finally {
                this.loading = false;
            }
        },

        // ==========================================
        // EKSEKUSI HAPUS DATA
        // ==========================================
        async executeHapus(id) {
            if (confirm("Apakah Anda yakin ingin menghapus laporan aduan ini?")) {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.post(`${this.apiUrl}/pengaduan/delete/${id}`, {}, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    if (response.status === 200 || response.data.success) {
                        alert("Data laporan sukses dihapus dari phpMyAdmin! 🗑️");
                        this.loadData(); // Memuat ulang tabel biar otomatis berkurang
                    }
                } catch (error) {
                    console.error("Error Hapus:", error);
                    alert("Aksi hapus gagal! Cek integritas tabel database.");
                }
            }
        },

        // ==========================================
        // PROSES LOGOUT
        // ==========================================
        handleLogout() {
            localStorage.clear();
            this.isLoggedIn = false;
            this.loginForm.email = '';
            this.loginForm.password = '';
            this.listPengaduan = [];
        }
    }
}).mount('#app');