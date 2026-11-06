import LegalPage from '../components/LegalPage';
import { licenseAgreementEn } from '../content/licenseAgreement';

export default function LicenseAgreement() {
  return <LegalPage doc={licenseAgreementEn} />;
}
