import logoPoli from '../assets/logo-poli.png';
import logoUpe60 from '../assets/logo-upe-60.png';
import logoSCTIGov from '../assets/logo-scti-gov.png';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-100 text-gray-700 py-6 md:py-8 w-full border-t border-gray-200">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
        {/* Left Section: POLI UPE 60 Anos */}
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
          <img src={logoPoli} alt="POLI" className="h-8 md:h-10" />
          <img src={logoUpe60} alt="UPE 60 Anos" className="h-10 md:h-12" />
        </div>

        {/* Right Section: Secretaria CT&I and Governo PE */}
        <div className="flex justify-center md:justify-end">
          <img src={logoSCTIGov} alt="Secretaria de Ciência, Tecnologia e Inovação / Governo de Pernambuco" className="h-12 md:h-16" />
        </div>
      </div>

      {/* Copyright Text */}
      <div className="mt-6 text-center text-sm">
        <p>© {currentYear} Observatório de Projetos - POLI/UPE. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;