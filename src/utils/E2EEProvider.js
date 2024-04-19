import forge from "node-forge";

export const generateKeyPair = () => {
    let keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048});
    let privateKey = forge.pki.privateKeyToPem(keyPair.privateKey);
    let publicKey = forge.pki.publicKeyToPem(keyPair.publicKey);
    localStorage.setItem("user-private-key", extractRawKeyValue(privateKey));
    localStorage.setItem("user-public-key", extractRawKeyValue(publicKey));
}


const extractRawKeyValue = (encryptionKey) => {
    return encryptionKey
    .replace("-----BEGIN PUBLIC KEY-----", "")
    .replace("-----END PUBLIC KEY-----", "")
    .replace("-----BEGIN RSA PRIVATE KEY-----", "")
    .replace("-----END RSA PRIVATE KEY-----", "")
    .replace(/\n/g, "")
    .replace(/\s+/g, "")
    .trim();
}
