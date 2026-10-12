# Lineo – suunnitelma

Lineo on selaimessa toimiva kuvankäsittely- ja piirto-ohjelma. Yhteinen tyyli ja logo ovat kansiossa `shared/`.
Erikoisuus on ääriviivat maalausten kuvista. Ohjelma on vain omaan käyttöön, kaikki toimii selaimessa
ja kuvat pysyvät omalla koneella. Ominaisuudet saavat olla samanlaisia kuin Photoshopissa, ulkoasu on tumma ja selkeä.

**Tärkein idea:** ääriviivat syntyvät nopeasti automaattisesti tai tekoälyn avulla, ja niitä voi sen
jälkeen säätää ja viimeistellä itse. Kaikki toimii yhdessä samassa kuvassa tasoina.

## Tekninen pohja (älä riko)

- Staattinen web-sovellus **ilman build-vaihetta**.
- Netlify julkaisee sen suoraan GitHubista (*Build command* ja *Publish directory* tyhjinä).
- **Ei API-avaimia eikä palvelinta.**
- Asennettava **PWA**: manifest, service worker, toiminta ilman verkkoa, automaattinen päivitys.
- Toimii myös **puhelimella ja kosketuksella**.
- Kun tiedostoja lisätään tai muutetaan: lisää uusi tiedosto `sw.js`:n `APP_SHELL`-listaan ja kasvata `CACHE`-versiota
  vaiheen lopuksi, jotta asennettu sovellus saa päivityksen.

## Tila

| Vaihe | Sisältö | Tila |
| --- | --- | --- |
| 1 | Automaattiset ääriviivat | ✅ tehty |
| PWA | Manifest, kuvakkeet, service worker, offline, päivitys, iPhonen kotinäyttö, puhelinkäyttöliittymä | ✅ tehty |
| 2 | Tekoälyrajaus klikkaamalla, vektoriääriviiva | ✅ tehty |
| 3 | Tasot ja piirto | ✅ tehty |
| 4 | Valinnat ja muokkaus | ✅ tehty |
| 5 | Säädöt ja suotimet | ✅ tehty |
| 6 | Vienti ja tallennus | ✅ tehty |

## Vaiheet

### Vaihe 1 – automaattiset ääriviivat ✅
Kuvan lataus; reunantunnistus omalle tasolle; liukusäätimet (tarkkuus, paksuus, kohinanpoisto);
alkuperäinen himmeänä alla; PNG-lataus läpinäkyvällä taustalla.

### PWA-lisäys ✅
Manifest, kuvakkeet, service worker, offline-tila, automaattinen päivitys, iPhonen kotinäyttö, puhelinkäyttöliittymä.

### Vaihe 2 – tekoälyrajaus klikkaamalla ✅
Klikkaan kohdetta ja tekoäly rajaa sen; selaimessa toimiva segmentointimalli (Segment Anything, transformers.js),
kuvat eivät lähde palvelimelle; lisäklikkauksilla laajennus/poisto; vektoriääriviiva muokattavilla pisteillä ja
kaarten kahvoilla (kuten Photoshopin kynätyökalu); jokainen kohde omalle tasolleen; paksuus ja väri; latauspalkki mallille.

### Vaihe 3 – tasot ja piirto ✅
- [x] Tasot: lisää, poista, piilota, lukitse, järjestä, läpinäkyvyys
- [x] Tussi ja sivellin: koko, väri, kovuus, stabilointi
- [x] Pyyhekumi
- [x] Zoomaus ja liikuttelu (rulla, nipistys, välilyönti, Käsi-työkalu)
- [x] Kumoa / tee uudelleen (vedot, tasojen lisäys / poisto / järjestys / läpinäkyvyys)
- [x] Toimii yhdessä vaiheen 1 ääriviivatason ja vaiheen 2 vektorikohteiden kanssa
  (ääriviivatasoa voi pyyhkiä ja piirtää; silloin automaattiset säätimet lukitaan, kunnes ne lasketaan uudelleen)
- [x] Service worker päivitetty (versio 2, `js/brush.js` lisätty)

Rajaukset ja päätökset:
- *Alkuperäinen* on aina lukittu ja sitä ei voi poistaa (reunantunnistus ja tekoäly käyttävät sitä lähteenä).
  Jos alkuperäistä halutaan joskus muokata (esim. säädöt vaiheessa 5), päätetään se silloin.
- *Ääriviivat*-tasoa ei voi poistaa, mutta sen voi piilottaa.
- Jos aktiivinen taso on alkuperäinen tai vektoritaso, piirto luo automaattisesti uuden rasteritason päällimmäiseksi (kumottavissa).
- Lukittua tasoa ei voi piirtää, muokata eikä poistaa. Näkyvyys, järjestys ja läpinäkyvyys toimivat.
- Historia on rajattu muistin mukaan (200 askelta tai noin 450 Mt, puhelimessa noin 150 Mt).

### Vaihe 4 – valinnat ja muokkaus ✅
- [x] Suorakulmio (M), lasso (L), taikasauva (Shift+W); uusi / lisää / vähennä; valinnan siirto, laajennus, supistus, käännös
- [x] Valinnan siirto, kopio (Ctrl+J, myös alkuperäisestä), leikkaus, poisto (Delete)
- [x] Täyttö: täyttötyökalu (K) ja "Täytä värillä"; liukuväri (G), lineaarinen ja säteittäinen, toiseen väriin tai läpinäkyväksi
- [x] Muunnos (T): skaalaus, kierto, peilaus, siirto, myös vektorikohteille
- [x] Rajaus (C): mittasuhteet, koskee kaikkia tasoja, ääriviivat lasketaan uudelleen
- [x] Piirto, täyttö, liukuväri, siirto ja poisto rajautuvat valintaan; kaikki kumottavissa
- [x] Ctrl+C / Ctrl+X / Ctrl+V ohjelman sisällä (uusi taso samaan kohtaan), muualta tullut uudempi kuva liitetään, puhelimessa Muokkaa-valikko
- [x] Kankaan koko (Ctrl+Alt+C): leveys/korkeus, ankkuri 3 × 3, tausta läpinäkyvä/valkoinen/musta; rajaus kuvan ulkopuolelle kasvattaa kangasta
- [x] Service worker päivitetty (versio 4, `js/select.js` lisätty)

Päätökset:
- Taikasauvan ja täytön lähde valittavissa (alkuperäinen / aktiivinen taso / viivatasot). Taikasauvan oletus on alkuperäinen kuva, täytön oletus viivatasot.
- Muunnoksen ja siirron laatikko seuraa tason sisältöä (tai valintaa), ei koko kangasta.
- Rajaus voi ulottua kuvan ulkopuolelle (yhden kuvan verran joka suuntaan); silloin kangas kasvaa. Kangas on rajattu 20 megapikseliin (puhelimessa 10).
- Leikepöytä: ohjelman oma kopio + kirjoitus järjestelmän leikepöydälle. Liittäessä verrataan leikepöydän kuvaa omaan kopioon: sama kuva = liitetään samaan kohtaan, muu kuva = uudelle tasolle keskelle. Jos selain ei salli leikepöydälle kirjoitusta, vanha kuva leikepöydällä voi voittaa oman kopion; silloin valikon Liitä tai uusi kopiointi auttaa.
- Muualta liitetty kuva menee nyt uudelle tasolle, jos kuva on auki (aiemmin se korvasi avoimen kuvan). Ilman avointa kuvaa se avataan kuten ennen.
- Kankaan koon muutoksessa vain alkuperäinen kuva saa taustavärin, muut tasot jäävät läpinäkyviksi (kuten Photoshopin Background-taso). Reunantunnistus tulkitsee läpinäkyvän alueen valkoiseksi.
- Valinta on pikselimaski; sen reuna näkyy staattisena katkoviivana.

### Vaihe 5 – säädöt ja suotimet ✅
- [x] Kirkkaus/kontrasti, sävy/kylläisyys/vaaleus, Levels (histogrammi, kanavat, automaattinen), Käyrät (muokattava, kanavat)
- [x] Mustavalkoinen, käänteiset värit, sumennus, terävöinti
- [x] Säädöt kohdistuvat aktiiviseen rasteritasoon tai valintaan; esikatselu kevennetystä kopiosta, täysi tarkkuus Käytä-painikkeesta; kumottavissa
- [x] Ääriviivatyylit: ohut tussi, paksu sarjakuva, lyijykynä (automaattisille viivoille ja vektorikohteille)
- [x] Pipetti (I, Alt-klikkaus muissa työkaluissa) ja oma paletti (tallentuu selaimeen), paletti myös ääriviivojen ja vektoriviivan väriin
- [x] Service worker päivitetty (versio 5, `js/filters.js` lisätty)

Päätökset:
- **Alkuperäisen kuvan säätö sallitaan** (aiempi avoin kysymys): säädetty kuva on uusi lähde, joten ääriviivat lasketaan uudelleen ja tekoälyn analyysi tehdään uudestaan. Alkuperäisen piirtäminen on edelleen estetty.
- Säädöt tehdään tuhoavasti (kuten Photoshopin Image → Adjustments), ei säätötasoina. Kumoa palauttaa. Säätötasot voidaan lisätä myöhemmin, jos tarvetta.
- Vektorikohteille ei ole pikselisäätöjä; niiden tyyli säädetään viivan paksuudella, värillä ja tyylillä.
- Lyijykynätyyli: automaattisille viivoille raekuvio lasketaan viivakuvaan (deterministinen, ei vilku), vektoreille se piirretään kahtena katkeilevana kierroksena.
- Pipetin oletuslähde on alkuperäinen kuva (oikeat värit); "näkyvä kuva" sisältää himmennetyn alkuperäisen.
- Paletti tallentuu selaimen paikalliseen tallennustilaan; viennin/tuonnin voi lisätä vaiheessa 6 projektitallennuksen yhteydessä.

### Vaihe 6 – vienti ja tallennus ✅
- [x] **Maalaus + ääriviivat yhtenä kuvana** (alkuperäinen 100 %:n näkyvyydellä, ääriviivat ja piirretyt tasot päällä)
- [x] **Pelkät ääriviivat** ilman alkuperäistä kuvaa: tausta läpinäkyvä, valkoinen, musta tai oma väri
- [x] **Kohteen leikkaus**: alkuperäisen kuvan pikselit vektorikohteen, kaikkien kohteiden tai valinnan mukaan; rajaus kohteen reunoihin, ääriviiva mukaan, tausta
- [x] **Alkuperäinen koko**: alkuperäinen tiedosto säilytetään pienennetyn kuvan taustalla; ääriviivat lasketaan täydessä koossa, vektorit skaalataan, rajaukset ja alkuperäisen säädöt toistetaan
- [x] Muodot PNG, JPG (laatu) ja SVG (vektoriääriviivat)
- [x] Valinta vektorikohteesta; Ctrl+J kopioi kohteen alkuperäisestä kuvasta
- [x] **Projektin tallennus tasoineen** (.lineo): tasot, vektorit, asetukset, tyyli, paletti, alkuperäinen tiedosto; suora tallennus samaan tiedostoon (Chrome/Edge), muuten lataus; Ctrl+S / Ctrl+Shift+S
- [x] Tallentamattomien muutosten merkki ja varoitukset (sivun sulku, toisen kuvan avaus)
- [x] Paletin vienti ja tuonti
- [x] Photoshop-tyyliset pikanäppäimet kokonaisuutena (B, E, V, P, Ctrl+Z jne.), X/D, pikanäppäinikkuna (? / F1)
- [x] Service worker päivitetty (versio 6, `js/files.js` lisätty)

Päätökset:
- Vienti-painike (yläpalkki) avaa vientiikkunan, jonka oletus on "maalaus ja ääriviivat yhtenä kuvana". Ctrl+S tallentaa nyt **projektin** (ei enää PNG:tä); Ctrl+E vie kuvan.
- Isoja kuvia ei kysytä avatessa: pienennys kerrotaan ilmoituksella, ja täysikokoinen vienti on valittavissa viennissä.
- Täysikokoinen ääriviivalaskenta tehdään vain, jos kuva mahtuu muistirajaan (36 Mpx, puhelimessa 12 Mpx); muuten ääriviivat skaalataan työkopiosta.
- Alkuperäisen kuvan säädöt toistetaan täysikokoiselle kuvalle (myös valintaan rajatut). Kankaan laajennuksen taustaväri on yhteinen koko alkuperäiselle (viimeksi käytetty).
- Projektitiedosto on oma binäärimuoto (LINEOPJ1 + JSON + PNG-lohkot), ei zip. Kumoamishistoria ei tallennu.
- Tallennus tapahtuu käyttäjän koneelle (ei palvelinta). Selaimen paikallinen tallennustila vain paletille ja viennin asetuksille.

## Käyttökokemuksen perusteella tehdyt muutokset

- **Alkutila:** kuva avautuu sellaisenaan (ei automaattisia ääriviivoja, alkuperäinen 100 %). Ääriviivat luodaan napista **Luo ääriviivat** tai säätimellä; silloin alkuperäinen himmenee 35 %:iin. Tila (ääriviivat päällä / ei) tallentuu projektiin; vanhat projektit avautuvat ääriviivat päällä.
- **Puhdas sivupaneeli alussa:** automaattisten ääriviivojen säätimet (tarkkuus, paksuus, kohinan poisto, tyylit, väri) ja alkuperäisen läpinäkyvyys näkyvät vasta, kun ääriviivat on luotu. Osiot voi piilottaa otsikkoa napauttamalla; "Poista automaattiset ääriviivat" palauttaa alkutilan (100 %, kumottavissa).
- **Kynä (P) piirtää viivoja itse:** klikkaus tyhjään aloittaa uuden viivan (oma vektoritaso, kuten tekoälyllä), klikkaukset lisäävät pisteitä, raahaus tekee kaaren, ensimmäisen pisteen klikkaus sulkee, Enter lopettaa, Ctrl+Z poistaa viimeisen pisteen, Shift lisää aktiiviseen tasoon. Sama työkalu muokkaa valmiita viivoja. Käsin piirretyllä viivalla ei ole "Muodon tarkkuus" -säädintä (vain tekoälyrajauksilla).
- **Automaattisten ääriviivojen osio** (ja Luo ääriviivat) näkyy vasta kynä- tai tekoälytyökalulla (tai kun ääriviivataso on valittuna ja ääriviivat on luotu). Käsityökalulla näkyy vain Aloita-ohje.
- **Tekoälyvirheen syy** näytetään ilmoituksessa, jos mallin lataus epäonnistuu (malli ladataan netistä ensimmäisellä kerralla).
- **Uusi:** Tiedosto → Uusi (Ctrl+Alt+N) palaa tyhjään aloitusnäkymään ilman sovelluksen sulkemista.
- Piirto tyhjälle (luomattomalle) ääriviivatasolle menee automaattisesti uudelle tasolle, ettei se lukitse automaattisia ääriviivoja. Vienti ei laske ääriviivoja, jos niitä ei ole luotu.
- Service worker versio 7.
- Avoin ehdotus: "Uusi tyhjä kanvas" (esim. valkoinen sivu piirtämiseen, ilman kuvaa) voidaan lisätä, jos tarvitaan.

## Työtapa

- Yksi vaihe kerrallaan: seuraava vaihe aloitetaan vasta, kun käyttäjä sanoo "tee vaihe N". Kaikki suunnitelman vaiheet 1–6 on nyt tehty.
- Rakennetaan olemassa olevan koodin päälle, mitään ei tehdä alusta uudelleen.
- Tämä tiedosto päivitetään aina vaiheen lopuksi.

## Huomioita nykytilasta

- Tekoälymalli ja kirjasto ladataan verkosta (jsDelivr, Hugging Face) ensimmäisellä käyttökerralla ja jäävät sen jälkeen
  selaimen välimuistiin. Kuva ei lähde koneelta. Ilman verkkoa ensimmäisellä kerralla käytetään värialuerajausta.
- README kertoo nyt sekä Netlify- että GitHub Pages -julkaisusta.

## Jatkokorjaukset (kynä ja tekoälyn virheilmoitus) [TEHTY]
- Kynä (P): kun vaihdat kesken viivan käsityökaluun katsomaan tulosta ja palaat kynään, viiva jatkuu viimeisestä pisteestä (sama viiva, yksi kumoamisaskel). Muut työkalut lopettavat viivan kuten ennenkin.
- Tekoäly: latausvirhe näytetään jäävänä tekstinä tekoälyosiossa (ei vain katoavana ilmoituksena), ja kirjaston latausvirheen todellinen syy tulee näkyviin. Välimuistiversio 8.
- Kynä: kesken piirron klikkaus olemassa olevan viivan tai pisteen päälle lopettaa piirron ja siirtyy muokkaamaan, joten viivaa voi taivuttaa keskeltä (aiemmin se lisäsi uuden pisteen). Ensimmäisen/viimeisen pisteen klikkaus sulkee/lopettaa edelleen.
- Kynä: taivutuksen jälkeen seuraava tyhjään klikkaus jatkaa samaa viivaa sen viimeisestä pisteestä. Viiva päättyy vasta Enterillä/Escillä, sulkemalla, viimeisen pisteen klikkauksella tai työkalun/tason vaihdolla; Shift+klikkaus aloittaa uuden viivan.
- Kynä: viiva jää jatkettavaksi aina, kun piirto keskeytyy (taivutus, työkalun vaihto kuten käsi tai tekoäly, viimeisen pisteen klikkaus). Vain Enter/Esc, sulkeminen, Shift+klikkaus tai tason vaihto aloittaa uuden viivan.

## Automaattiset ääriviivat poistettu käyttöliittymästä [TEHTY]
- "Luo ääriviivat" -osio (tarkkuus, viivan paksuus, kohinan poisto, väri, alkuperäisen läpinäkyvyys) ei enää näy missään työkalussa. Ääriviivat tehdään kynällä (P) tai tekoälyllä (W), ja kuvan läpinäkyvyyden säätää tasopaneelista. Vanhat koodipolut jäävät piiloon, jotta vanhat projektitiedostot aukeavat.

## Tason valinta napauttamalla (käsityökalu) ja tekoälyn jumiutumisen havaitseminen [TEHTY]
- Käsityökalulla (H) napautus viivaan tai piirrokseen valitsee sen tason; vektoriviivalle tulee näkyviin viivan paksuus ja väri, joita voi muokata jälkikäteen. Sivellinjälkeen valitaan sen taso (pikseleitä ei voi enää paksuntaa).
- Tekoäly: jos mallin lataus ei etene 90 sekuntiin tai kuvan analyysi 4 minuuttiin, siitä tulee virheilmoitus eikä hiljaista odotusta.

## Tekoälyrajausten yhdistäminen ja kynäviivojen jatkaminen päistä [TEHTY]
- Tekoäly (W): jokainen lisäklikkaus rajataan omana alueenaan (esim. yksi maalialue). Valmis-ääriviivassa on ulkoreuna koko valinnan ympäri ja alueiden välissä yksi yhteinen rajaviiva (ei tuplaviivaa); kapea sauma alueiden välissä jaetaan lähimmälle alueelle. Sama koskee värialuerajausta.
- Kynä (P): avoimen viivan päätepisteen napautus (myös toisella tasolla) valitsee viivan, ja seuraava tyhjään klikkaus jatkaa viivaa siitä päästä. Kesken piirron toisen avoimen viivan päätepisteen klikkaus yhdistää viivat yhdeksi (myös eri tasoilta; tyhjäksi jäävä taso poistuu). Yksi Ctrl+Z kumoaa yhdistämisen.
- Kynä (P): napautettu (oranssi) piste on seuraavan viivan lähtöpiste. Päätepisteestä viiva jatkuu, keskipisteestä tai suljetun muodon pisteestä lähtee uusi haara samalle tasolle. Kesken piirron toisen viivan pisteen klikkaus päättää viivan täsmälleen siihen pisteeseen (avoimen viivan pää yhdistää viivat).

## Nimenvaihto Lineoksi [TEHTY]
- Ohjelman nimi on Lineo kaikkialla: sivun otsikko, yläpalkin nimi, manifest (name, short_name), service workerin välimuistit (`lineo-v18`, `lineo-lib-v1`), README, ohjeet ja koodin sisäiset nimet (`lineo-`-tyyliluokat ja -muuttujat, `shared/lineo-theme.css`, moduulit `Lineo…`, `window.Lineo`, `LineoConfig`).
- Uusi logo: L-kirjain, jonka pohja jatkuu viivana ja päättyy korostusvärin pisteeseen. Kuvakkeet (`icons/`) ja favicon tehty uudelleen; lähteet `shared/lineo-logo.svg`, `icons/lineo-apple.svg`, `icons/lineo-maskable.svg`.
- Projektit tallennetaan `.lineo`-tiedostoina (tunniste `LINEOPJ1`). Selaimen tallennusavaimet `lineo-palette` ja `lineo-export`.
- README englanniksi, suomenkielinen käyttöohje tiedostossa `OHJE.md`.
