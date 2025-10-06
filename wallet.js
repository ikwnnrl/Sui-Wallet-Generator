/**
 * SUI Wallet Toolkit Interaktif
 * =============================
 * Versi ini mengotomatiskan Opsi 2 dan 3 untuk berjalan tanpa input manual.
 *
 * PENTING: File yang berisi informasi sensitif seperti private key dan seed phrase
 * TIDAK PERNAH boleh dibagikan kepada siapapun.
 */

import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { writeFileSync, appendFileSync, mkdirSync, readFileSync } from "fs";
import path from "path";
import { generateMnemonic, validateMnemonic } from "bip39";
import readline from "readline";

// ===================================================================================
// FUNGSI INTI (Core Functions)
// ===================================================================================

/**
 * Membuat satu dompet Sui lengkap dari seed phrase yang baru dibuat.
 * @returns {object} Objek yang berisi mnemonic, address, dan privateKey.
 */
function createWalletFromMnemonic() {
    const mnemonic = generateMnemonic();
    const keypair = Ed25519Keypair.deriveKeypair(mnemonic);
    const address = keypair.toSuiAddress();
    const privateKey = keypair.getSecretKey();
    return { mnemonic, address, privateKey };
}

// ===================================================================================
// OPSI MENU
// ===================================================================================

/**
 * [Opsi 1] Membuat dompet SUI baru secara massal.
 */
function generateWallets(rl, callback) {
    rl.question("➡️ Masukkan jumlah dompet yang ingin dibuat: ", (answer) => {
        const walletCount = parseInt(answer, 10);

        if (isNaN(walletCount) || walletCount <= 0) {
            console.error("\n❌ Input tidak valid. Harap masukkan angka yang lebih besar dari 0.");
            console.log("\n");
            callback();
            return;
        }

        const outputDir = 'hasil';
        const fileNames = {
            seed: path.join(outputDir, 'seedpharse.txt'),
            address: path.join(outputDir, 'address.txt'),
            privateKey: path.join(outputDir, 'suipriv.txt')
        };

        try {
            console.log(`\n⚙️ Memulai proses pembuatan ${walletCount} dompet...`);
            mkdirSync(outputDir, { recursive: true });
            console.log(`📂 Output akan disimpan di dalam folder '${outputDir}'`);

            writeFileSync(fileNames.seed, `===== SUI Seed Phrases =====\n\n`);
            writeFileSync(fileNames.address, `===== SUI Addresses =====\n\n`);
            writeFileSync(fileNames.privateKey, `===== SUI Private Keys (Base64) =====\n\n`);

            for (let i = 0; i < walletCount; i++) {
                const wallet = createWalletFromMnemonic();
                appendFileSync(fileNames.seed, `${wallet.mnemonic}\n`);
                appendFileSync(fileNames.address, `${wallet.address}\n`);
                appendFileSync(fileNames.privateKey, `${wallet.privateKey}\n`);
                console.log(`✅ Dompet #${i + 1} berhasil dibuat dan disimpan.`);
            }

            console.log(`\n🎉 Selesai! ${walletCount} dompet telah berhasil dibuat.`);
            console.log(`Data tersimpan di dalam folder: ${outputDir}`);
            console.warn(`\n🚨 PERINGATAN KEAMANAN: Jaga kerahasiaan file di dalam folder '${outputDir}'! 🚨`);
        } catch (error) {
            console.error("\nTerjadi kesalahan saat membuat dompet:", error);
        } finally {
            console.log("\n");
            callback();
        }
    });
}

/**
 * [Opsi 2] Mengonversi 'seedpharse.txt' menjadi 'pk_from_seed.txt' (Otomatis).
 */
function convertSeedFileToPkFile(rl, callback) {
    const outputDir = 'hasil';
    const inputFilename = 'seedpharse.txt';
    const outputFilename = 'pk_from_seed.txt';
    const inputPath = path.join(outputDir, inputFilename);
    const outputPath = path.join(outputDir, outputFilename);

    console.log(`\n⚙️ Proses otomatis dimulai...`);
    console.log(`   Membaca dari: ${inputPath}`);
    console.log(`   Menyimpan ke : ${outputPath}\n`);

    try {
        mkdirSync(outputDir, { recursive: true });
        
        const fileContent = readFileSync(inputPath, 'utf-8');
        const lines = fileContent.split('\n').filter(line => line.trim() !== '' && !line.trim().startsWith('=='));

        if (lines.length === 0) {
            console.log("📄 File input kosong atau tidak berisi data yang valid.");
            console.log("\n");
            callback();
            return;
        }

        console.log(`⚙️ Memproses ${lines.length} seed phrase dari ${inputFilename}...`);
        const privateKeys = [];
        let successCount = 0;
        let failCount = 0;

        lines.forEach((line) => {
            const trimmedLine = line.trim();
            if (validateMnemonic(trimmedLine)) {
                const keypair = Ed25519Keypair.deriveKeypair(trimmedLine);
                privateKeys.push(keypair.getSecretKey());
                successCount++;
            } else {
                console.warn(`   [Gagal] Melewati baris tidak valid: "${trimmedLine.substring(0, 25)}..."`);
                failCount++;
            }
        });
        
        const outputContent = `===== SUI Private Keys (Base64) - Hasil Konversi =====\n\n${privateKeys.join('\n')}`;
        writeFileSync(outputPath, outputContent);

        console.log(`\n🎉 Selesai!`);
        console.log(`   - Berhasil dikonversi: ${successCount}`);
        console.log(`   - Gagal/Dilewati   : ${failCount}`);
        console.log(`   - File private key baru telah disimpan di: ${outputPath}`);
        console.warn(`\n🚨 PERINGATAN KEAMANAN: Jaga kerahasiaan file '${outputFilename}' di dalam folder 'hasil'! 🚨`);

    } catch (error) {
        if (error.code === 'ENOENT') {
            console.error(`\n❌ File input default '${inputFilename}' tidak ditemukan di dalam folder 'hasil'.`);
            console.error(`   Pastikan Anda telah menjalankan Opsi 1 terlebih dahulu untuk membuat file tersebut.`);
        } else {
            console.error("\n❌ Terjadi kesalahan:", error.message);
        }
    } finally {
        console.log("\n");
        callback();
    }
}

/**
 * [Opsi 3] Melihat alamat dari 'seedpharse.txt' dan 'suipriv.txt' (Otomatis).
 */
function getAddressesFromFile(rl, callback) {
    const outputDir = 'hasil';
    const seedFilename = 'seedpharse.txt';
    const pkFilename = 'suipriv.txt';
    const seedPath = path.join(outputDir, seedFilename);
    const pkPath = path.join(outputDir, pkFilename);
    let fileFound = false;

    console.log("\n⚙️ Proses otomatis dimulai: Melihat alamat dari file-file default...");
    mkdirSync(outputDir, { recursive: true });

    // --- Bagian 1: Memproses File Seed Phrase ---
    try {
        const seedFileContent = readFileSync(seedPath, 'utf-8');
        const seedLines = seedFileContent.split('\n').filter(line => line.trim() !== '' && !line.trim().startsWith('=='));
        
        if (seedLines.length > 0) {
            fileFound = true;
            console.log(`\n📬 Alamat dari ${seedPath}:\n`);
            seedLines.forEach((line) => {
                const trimmedLine = line.trim();
                try {
                    if (!validateMnemonic(trimmedLine)) throw new Error("Seed phrase tidak valid");
                    const keypair = Ed25519Keypair.deriveKeypair(trimmedLine);
                    console.log(`   ${keypair.toSuiAddress()}`);
                } catch (e) {
                     console.warn(`   [Gagal] Melewati baris seed phrase tidak valid.`);
                }
            });
        }
    } catch (error) {
        if (error.code !== 'ENOENT') console.error(`\n❌ Gagal membaca ${seedPath}:`, error.message);
    }

    // --- Bagian 2: Memproses File Private Key ---
    try {
        const pkFileContent = readFileSync(pkPath, 'utf-8');
        const pkLines = pkFileContent.split('\n').filter(line => line.trim() !== '' && !line.trim().startsWith('=='));

        if (pkLines.length > 0) {
            fileFound = true;
            console.log(`\n📬 Alamat dari ${pkPath}:\n`);
            pkLines.forEach((line) => {
                const trimmedLine = line.trim();
                try {
                    const privateKeyBytes = Buffer.from(trimmedLine, 'base64');
                    if (privateKeyBytes.length !== 32) throw new Error("Private key tidak valid");
                    const keypair = Ed25519Keypair.fromSecretKey(privateKeyBytes);
                    console.log(`   ${keypair.toSuiAddress()}`);
                } catch (e) {
                     console.warn(`   [Gagal] Melewati baris private key tidak valid.`);
                }
            });
        }
    } catch (error) {
        if (error.code !== 'ENOENT') console.error(`\n❌ Gagal membaca ${pkPath}:`, error.message);
    }

    if (!fileFound) {
        console.log(`\n❌ Tidak ditemukan file default ('${seedFilename}' atau '${pkFilename}') di dalam folder 'hasil'.`);
        console.log("   Jalankan Opsi 1 terlebih dahulu untuk membuat file-file tersebut.");
    }
    
    console.log("\n");
    callback(); // Kembali ke menu
}


// ===================================================================================
// FUNGSI UTAMA (Main Menu)
// ===================================================================================

/**
 * Menjalankan program utama dan menampilkan menu.
 */
function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    function showMenu() {
        console.log("======================================");
        console.log("     SUI Wallet Toolkit Interaktif    ");
        console.log("======================================");
        console.log("Pilih salah satu opsi:");
        console.log("1. Buat Dompet SUI Baru (Massal)");
        console.log("2. Konversi 'seedpharse.txt' -> 'pk_from_seed.txt' (Otomatis)");
        console.log("3. Lihat Alamat dari File Default (Otomatis)");
        console.log("4. Keluar");
        console.log("--------------------------------------");

        rl.question("Masukkan pilihan Anda (1-4): ", (choice) => {
            switch (choice.trim()) {
                case '1':
                    generateWallets(rl, showMenu);
                    break;
                case '2':
                    convertSeedFileToPkFile(rl, showMenu);
                    break;
                case '3':
                    getAddressesFromFile(rl, showMenu);
                    break;
                case '4':
                    console.log("\n👋 Terima kasih telah menggunakan toolkit ini. Sampai jumpa!");
                    rl.close();
                    break;
                default:
                    console.log("\n❌ Pilihan tidak valid. Harap masukkan angka antara 1 dan 4.\n");
                    showMenu();
                    break;
            }
        });
    }

    showMenu(); // Memulai menu untuk pertama kali
}

// Jalankan fungsi utama
main();