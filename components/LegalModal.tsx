import React, { useEffect } from 'react';
import { X } from 'lucide-react';

type LegalPage = 'impressum' | 'datenschutz' | 'agb';

interface LegalModalProps {
  page: LegalPage;
  onClose: () => void;
}

const IMPRESSUM = () => (
  <>
    <h2 className="text-xl font-light text-white mb-6">Impressum</h2>
    <p className="text-sm text-neutral-400 mb-1">Angaben gemäß § 5 TMG</p>

    <div className="mt-4 space-y-4 text-sm text-neutral-300 leading-relaxed">
      <div>
        <p className="text-white font-medium">Ben Poersch</p>
        <p>Grazer Damm 207</p>
        <p>12157 Berlin</p>
      </div>

      <div>
        <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1">Kontakt</p>
        <p>E-Mail: connect@dyai.cloud</p>
      </div>

      <div>
        <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1">Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</p>
        <p>Ben Poersch</p>
        <p>Grazer Damm 207</p>
        <p>12157 Berlin</p>
      </div>

      <div className="pt-4 border-t border-white/5">
        <p className="text-neutral-500 text-xs uppercase tracking-wider mb-2">Haftungsausschluss</p>
        <p className="text-neutral-400 text-xs leading-relaxed">
          Die Inhalte dieser Website werden mit größtmöglicher Sorgfalt erstellt. Der Anbieter übernimmt jedoch keine Gewähr für die Richtigkeit, Vollständigkeit und Aktualität der bereitgestellten Inhalte. Die Nutzung der Inhalte erfolgt auf eigene Gefahr. Namentlich gekennzeichnete Beiträge geben die Meinung des jeweiligen Autors und nicht immer die Meinung des Anbieters wieder.
        </p>
      </div>

      <div>
        <p className="text-neutral-500 text-xs uppercase tracking-wider mb-2">Haftung für Links</p>
        <p className="text-neutral-400 text-xs leading-relaxed">
          Diese Website enthält Links zu externen Websites Dritter, auf deren Inhalte kein Einfluss genommen werden kann. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter verantwortlich. Zum Zeitpunkt der Verlinkung wurden keine Rechtsverstöße erkennbar. Bei Bekanntwerden von Rechtsverletzungen werden entsprechende Links umgehend entfernt.
        </p>
      </div>
    </div>
  </>
);

const DATENSCHUTZ = () => (
  <>
    <h2 className="text-xl font-light text-white mb-6">Datenschutzerklärung</h2>

    <div className="space-y-6 text-sm text-neutral-300 leading-relaxed">
      <div>
        <h3 className="text-white font-medium mb-2">1. Verantwortlicher</h3>
        <p>Ben Poersch, Grazer Damm 207, 12157 Berlin</p>
        <p>E-Mail: connect@dyai.cloud</p>
      </div>

      <div>
        <h3 className="text-white font-medium mb-2">2. Erhebung und Speicherung personenbezogener Daten</h3>
        <p className="text-neutral-400">
          Beim Besuch dieser Website werden automatisch Informationen allgemeiner Natur erfasst. Diese Informationen (Server-Logfiles) beinhalten die Art des Webbrowsers, das verwendete Betriebssystem, den Domainnamen Ihres Internet-Service-Providers, Ihre IP-Adresse und ähnliches. Sie werden lediglich zur Sicherstellung eines störungsfreien Betriebs und zur Verbesserung unseres Angebots ausgewertet und erlauben keinen Rückschluss auf Ihre Person.
        </p>
      </div>

      <div>
        <h3 className="text-white font-medium mb-2">3. Cookies und lokale Speicherung</h3>
        <p className="text-neutral-400">
          Diese Website verwendet keine Tracking-Cookies. Es kann lokaler Browserspeicher (localStorage) verwendet werden, um Ihre Einstellungen innerhalb der Anwendung zu speichern. Diese Daten verbleiben ausschließlich in Ihrem Browser und werden nicht an Dritte übermittelt.
        </p>
      </div>

      <div>
        <h3 className="text-white font-medium mb-2">4. Externe Inhalte</h3>
        <p className="text-neutral-400">
          Diese Website bindet Inhalte von externen Anbietern ein, darunter Google Fonts (fonts.googleapis.com, fonts.gstatic.com) und ggf. Medieninhalte von Drittanbietern. Beim Abruf dieser Inhalte wird Ihre IP-Adresse an den jeweiligen Anbieter übermittelt. Weitere Informationen finden Sie in den Datenschutzerklärungen der jeweiligen Anbieter.
        </p>
      </div>

      <div>
        <h3 className="text-white font-medium mb-2">5. Ihre Rechte</h3>
        <p className="text-neutral-400">
          Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer personenbezogenen Daten. Sie haben zudem das Recht, sich bei einer Aufsichtsbehörde zu beschweren. Kontaktieren Sie uns hierzu unter der oben angegebenen E-Mail-Adresse.
        </p>
      </div>

      <div>
        <h3 className="text-white font-medium mb-2">6. Änderung der Datenschutzerklärung</h3>
        <p className="text-neutral-400">
          Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen umzusetzen.
        </p>
      </div>
    </div>
  </>
);

const AGB = () => (
  <>
    <h2 className="text-xl font-light text-white mb-6">Allgemeine Geschäftsbedingungen</h2>

    <div className="space-y-6 text-sm text-neutral-300 leading-relaxed">
      <div>
        <h3 className="text-white font-medium mb-2">1. Geltungsbereich</h3>
        <p className="text-neutral-400">
          Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung der Website von Ben Poersch, Grazer Damm 207, 12157 Berlin (nachfolgend „Anbieter"). Mit dem Zugriff auf diese Website erklären Sie sich mit diesen Bedingungen einverstanden.
        </p>
      </div>

      <div>
        <h3 className="text-white font-medium mb-2">2. Leistungsbeschreibung</h3>
        <p className="text-neutral-400">
          Diese Website dient als Portfolio und Präsentationsplattform. Der Anbieter behält sich vor, das Angebot jederzeit ohne Ankündigung zu ändern, zu ergänzen oder einzustellen.
        </p>
      </div>

      <div>
        <h3 className="text-white font-medium mb-2">3. Urheberrecht</h3>
        <p className="text-neutral-400">
          Die auf dieser Website veröffentlichten Inhalte und Werke unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung des Anbieters.
        </p>
      </div>

      <div>
        <h3 className="text-white font-medium mb-2">4. Haftungsbeschränkung</h3>
        <p className="text-neutral-400">
          Die Inhalte dieser Website werden mit größtmöglicher Sorgfalt erstellt. Der Anbieter übernimmt jedoch keine Gewähr für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte. Die Nutzung erfolgt auf eigene Gefahr.
        </p>
      </div>

      <div>
        <h3 className="text-white font-medium mb-2">5. Anwendbares Recht</h3>
        <p className="text-neutral-400">
          Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist Berlin, soweit gesetzlich zulässig.
        </p>
      </div>
    </div>
  </>
);

const PAGES: Record<LegalPage, React.FC> = {
  impressum: IMPRESSUM,
  datenschutz: DATENSCHUTZ,
  agb: AGB,
};

const LegalModal: React.FC<LegalModalProps> = ({ page, onClose }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const Content = PAGES[page];

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl max-h-[85vh] bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-white/5 shrink-0">
          <div className="flex gap-3">
            {(['impressum', 'datenschutz', 'agb'] as LegalPage[]).map((p) => (
              <span
                key={p}
                className={`text-[10px] uppercase tracking-widest cursor-default ${
                  p === page ? 'text-white' : 'text-neutral-600'
                }`}
              >
                {p === 'agb' ? 'AGB' : p === 'datenschutz' ? 'Datenschutz' : 'Impressum'}
              </span>
            ))}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-neutral-500 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <Content />
        </div>
      </div>
    </div>
  );
};

export default LegalModal;
