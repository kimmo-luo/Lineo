# Lineo – käyttöohje

Selaimessa toimiva ilmainen kuvankäsittely- ja piirto-ohjelma maalausten ääriviivoja varten (avoin lähdekoodi, MIT-lisenssi).

Kaikki tapahtuu omassa selaimessa: kuvia ei lähetetä minnekään.

Käyttöliittymä on suomeksi ja englanniksi. Kieli vaihdetaan yläpalkin **FI / EN** -napeista.
Oletuksena on selaimen kieli (suomi, muuten englanti), ja valinta muistetaan selaimessa.
Tämä käyttöohje on suomeksi.

## Käynnistys

**Nopeimmin:** avaa `index.html` selaimessa (tuplaklikkaus). Ei asennuksia, ei build-vaihetta.
Näin ohjelma toimii heti, mutta ei asennettavana sovelluksena eikä ilman verkkoa tallennettuna.

**Asennettavana sovelluksena (PWA)** ohjelma pitää tarjoilla https-osoitteesta tai localhostista:

- Netlify: *Add new site → Import from Git* ja valitse tämä repo. Jätä **Build command** ja **Publish directory** tyhjiksi.
  Ei API-avaimia eikä palvelinta.
- GitHub Pages: repon *Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)`*.
  Osoite on muotoa `https://<käyttäjä>.github.io/<repon-nimi>/`.
- Tai omalla koneella: `python3 -m http.server 8000` ja selaimeen `http://localhost:8000`.

### Asennus

- **Chrome / Edge (Windows, Mac, Linux, Android):** avaa osoite ja klikkaa osoiterivin
  oikeassa reunassa olevaa asennuskuvaketta, tai valitse valikosta *Asenna Lineo*
  (Edge: *Sovellukset → Asenna tämä sivusto sovelluksena*).
  Ohjelma aukeaa omaan ikkunaansa, ja sen saa työpöydälle tai tehtäväpalkkiin.
- **iPhone / iPad:** avaa osoite **Safarissa** → Jaa-painike → *Lisää Koti-valikkoon* → *Lisää*.

### Päivitykset ja toiminta ilman verkkoa

Service worker (`sw.js`) tallentaa ohjelman tiedostot välimuistiin. Kun verkko on
käytössä, tiedostot haetaan aina ensin verkosta, joten GitHubiin tehty päivitys tulee
käyttöön automaattisesti seuraavalla avauskerralla. Ilman verkkoa käytetään
välimuistiin tallennettua versiota. Kuvat eivät koskaan kulje service workerin kautta
eivätkä lähde koneelta.

Uutta tiedostoa lisättäessä se kannattaa lisätä `sw.js`:n `APP_SHELL`-listaan, jotta
se toimii heti ensimmäisestä avauksesta lähtien myös ilman verkkoa.

### Puhelimella ja kosketusnäytöllä

- Kuvaa zoomataan nipistämällä kahdella sormella ja liikutetaan yhdellä sormella.
- Tuplanapautus vaihtaa koko kuvan näkymän ja 100 %:n välillä. Myös tilarivin zoom-lukema sovittaa kuvan ruutuun.
- **Säädöt**-painike piilottaa säätöpaneelin, jolloin kuva saa koko ruudun.
- Tietokoneella rulla tai kosketuslevyn nipistys zoomaa, raahaus liikuttaa, Ctrl+0 sovittaa ja Ctrl+1 näyttää 100 %.

## Kuvan avaus ja ääriviivat

- Kuvan avaus raahaamalla, **Avaa kuva** -napista (Ctrl+O) tai liittämällä (Ctrl+V).
- Kuva avautuu sellaisenaan omalle *Alkuperäinen*-tasolleen. Ääriviivat tehdään itse **kynällä (P)** tai **tekoälyrajauksella (W)** (katso alla). Käsityökalulla sivupaneelissa näkyy lyhyt Aloita-ohje.
- Alkuperäisen kuvan läpinäkyvyyden säädät tasopaneelin **Tason läpinäkyvyys** -säätimellä, kun alkuperäinen on valittuna. Himmennetyn kuvan päällä viivat erottuvat paremmin.
- Yli 4096 px kuvat pienennetään työskentelykokoon. Alkuperäinen koko säilyy ja on valittavissa viennissä.
- **Vie** (Ctrl+E): maalaus ja ääriviivat yhtenä kuvana, pelkät viivat tai kohteen leikkaus (katso Vaihe 6).

Ohjelmassa ei ole enää automaattisten ääriviivojen säätimiä (Luo ääriviivat, tarkkuus, paksuus, kohinan poisto).
Vanhat projektitiedostot, joissa on automaattisia ääriviivoja, aukeavat silti, ja niiden viivat näkyvät *Ääriviivat*-tasolla.

## Vaihe 2 – tekoälyrajaus klikkaamalla ✅

- **Tekoälyrajaus (W):** klikkaa kohdetta (esim. härkää), niin tekoäly rajaa koko kohteen.
  Lisäklikkaukset laajentavat rajausta. **Poista**-tilassa, Alt-klikkauksella tai hiiren oikealla
  napilla klikkaus poistaa rajauksesta osan. Ctrl+Z poistaa viimeisen klikkauksen.
  **Valmis** (Enter) tekee rajauksesta vektoriääriviivan omalle tasolleen, **Peru** (Esc) hylkää rajauksen.
- **Kynä (P)**, kuten Photoshopin kynätyökalu: piirrä ääriviiva itse samalla tavalla kuin tekoäly tekee sen. **Klikkaa tyhjää** aloittaaksesi uuden viivan (se saa oman vektoritasonsa),
  **lisää pisteitä klikkaamalla** (raahaus tekee pisteestä kaaren kahvoineen), **sulje viiva klikkaamalla ensimmäistä pistettä**, tai lopeta avoin viiva Enterillä tai viimeistä pistettä klikkaamalla.
  Ctrl+Z kesken piirron poistaa viimeisen pisteen. Shift + klikkaus tyhjään lisää viivan aktiiviseen vektoritasoon. Puhelimessa napautukset lisäävät pisteitä (kahdella sormella zoomaat ja liikutat).
  Valmista viivaa (myös tekoälyn tekemää) muokataan **samalla työkalulla**:
  - pisteiden raahaus
  - pisteen lisäys klikkaamalla viivaa
  - pisteen poisto (Delete tai *Poista piste*)
  - kahvojen raahaus (Alt taittaa kahvan)
  - tuplaklikkaus pisteeseen vaihtaa kulman ja kaaren
- **Jokainen kohde omalle tasolleen.** Tason voi valita tasolistasta tai klikkaamalla sen viivaa. Käsityökalulla (H) napautus viivaan tai piirrokseen valitsee sen tason.
- **Useampi alue kerralla:** tekoälyrajauksessa jokainen lisäklikkaus rajaa oman alueensa. Valmiissa ääriviivassa on ulkoreuna koko rajauksen ympäri ja vierekkäisten alueiden välissä yksi yhteinen rajaviiva.
- **Viivojen jatkaminen ja yhdistäminen kynällä:** avoimen viivan päätepisteen napautus valitsee viivan, ja seuraava klikkaus tyhjään jatkaa sitä siitä päästä. Kesken piirron toisen avoimen viivan päätepisteen klikkaus yhdistää viivat yhdeksi.
- **Viivan paksuus ja väri** ovat säädettävissä tasokohtaisesti. **Muodon tarkkuus** (vain tekoälyrajauksilla) laskee käyrän
  uudelleen alkuperäisestä rajauksesta: vähemmän tai enemmän pisteitä.
- **Kumoa / tee uudelleen** (Ctrl+Z / Ctrl+Shift+Z) myös työkalurivin napeista.
- **Latauspalkki:** mallin lataus näyttää edistymisen, ja kuvan analyysi odotusanimaation.
- **Käsi (H)** tai välilyönti + raahaus liikuttaa näkymää. Puhelimessa yksi sormi liikuttaa ja kaksi zoomaa.

### Miten tekoäly toimii

Malli on [SlimSAM](https://huggingface.co/Xenova/slimsam-77-uniform) (Segment Anything -mallin
kevennetty versio) tai valinnalla *Tekoäly – tarkka* [SAM ViT-B](https://huggingface.co/Xenova/sam-vit-base).
Se ajetaan [transformers.js](https://huggingface.co/docs/transformers.js):llä Web Workerissa
omalla koneella. **Kuva ei lähde minnekään.** Verkosta ladataan vain ohjelmakirjasto (jsDelivr)
ja mallin painot (Hugging Face) ensimmäisellä käyttökerralla, minkä jälkeen ne ovat selaimen
välimuistissa ja toimivat myös ilman verkkoa (asennetussa PWA-versiossa).

Kuva analysoidaan kerran (muutama sekunti), minkä jälkeen jokainen klikkaus on nopea.

Jos mallia ei saada ladattua (esim. ei verkkoa ensimmäisellä kerralla, tai `index.html` avattu
suoraan tiedostosta ja selain estää latauksen), ohjelma siirtyy **värialueen rajaukseen**: se valitsee
klikatun kohdan samanväriset, yhtenäiset alueet. Se toimii aina, mutta ei tunnista kohteita yhtä
fiksusti kuin tekoäly.

## Vaihe 3 – tasot ja piirto ✅

**Tasot** (Tasot-osio sivupaneelissa) toimivat yhdessä kynällä ja tekoälyllä tehtyjen vektoriviivojen kanssa:

- **+ Uusi taso:** tyhjä rasteritaso aktiivisen tason päälle. Siveltimellä ja tussilla piirretään rasteritasolle. Jos aktiivinen taso on alkuperäinen kuva tai vektorikohde, piirto menee automaattisesti uudelle tasolle päällimmäiseksi.
- **Ylös / alas:** tason järjestys. Ylinpänä oleva taso näkyy muiden päällä.
- **Silmä:** piilota / näytä taso. Piilotettu taso ei tule mukaan PNG-vientiin.
- **Lukitse:** lukittua tasoa ei voi piirtää, muokata (pisteet, viivan tyyli) eikä poistaa. Näkyvyys, järjestys ja läpinäkyvyys toimivat silti.
- **Poista:** poistaa aktiivisen tason (kumottavissa).
- **Tason läpinäkyvyys:** liukusäädin toimii kaikille tasoille, myös alkuperäiselle kuvalle ja vektorikohteille.
- **Alkuperäinen** on aina lukittu ja sitä ei voi poistaa, koska tekoäly käyttää sitä lähteenä. **Ääriviivat**-tasoa (vanhojen projektien automaattisia ääriviivoja varten) ei voi poistaa, mutta sen voi piilottaa. Jos taso on tyhjä, sille piirtäminen menee automaattisesti uudelle tasolle.

**Piirtotyökalut** (työkalurivi, kullakin työkalulla omat asetukset):

| Työkalu | Näppäin | Kuvaus |
| --- | --- | --- |
| Sivellin | B | pehmeä viiva, säädettävä **kovuus** |
| Tussi | N | tarkka, kova viiva (kynällä paine muuttaa paksuutta) |
| Pyyhekumi | E | poistaa pikseleitä aktiiviselta tasolta |

Asetukset: **koko** (1–500 px, logaritminen liukusäädin; `[` ja `]` muuttavat kokoa), **kovuus**, **stabilointi**
(tasoittaa vapisevan käden jälkeä: mitä suurempi, sitä pidemmällä "narulla" viiva seuraa osoitinta) ja **väri**.
Kankaalla näkyy siveltimen kokoinen ympyrä.

- **Kumoa / tee uudelleen** kattaa kaiken: vedot, tasojen lisäyksen, poiston, järjestyksen ja läpinäkyvyyden.
  Historia on rajattu muistin mukaan (puhelimessa pienempi), joten hyvin vanhat vedot unohtuvat.
- **Zoomaus ja liikuttelu:** rulla / nipistys zoomaa, välilyönti + raahaus, keskinappi tai Käsi (H) liikuttaa.
  Puhelimessa yksi sormi piirtää ja kaksi sormea zoomaa ja liikuttaa (kesken oleva veto perutaan).
- Viennissä piilotetut tasot jäävät pois (katso Vaihe 6).

## Vaihe 4 – valinnat ja muokkaus ✅

| Työkalu | Näppäin | Kuvaus |
| --- | --- | --- |
| Suorakulmiovalinta | M | vedä alue |
| Lasso | L | piirrä vapaa rajaus |
| Taikasauva | Shift+W | valitse samanväriset pikselit |
| Siirrä | V | siirtää valitut pikselit (tai koko tason). Alt-veto kopioi |
| Täyttö | K | täyttää napautetun alueen värillä |
| Liukuväri | G | vedä alkupisteestä loppupisteeseen |
| Muunnos | T | skaalaa, kierrä, peilaa, siirrä |
| Rajaus | C | rajaa koko kuva |

**Valinta.** Uusi / lisää / vähennä: paneelin napit, tai Shift (lisää), Alt (vähennä), Shift+Alt (leikkaus).
Valinnan sisältä raahaamalla suorakulmio- ja lassotyökalulla siirrät vain valinnan reunaviivan. Napautus valinnan ulkopuolelle poistaa valinnan.
Ctrl+A kaikki, Ctrl+D poista valinta, *Käännä*-painike (Ctrl+Shift+I) kääntää, *Laajenna* ja *Supista* muuttavat valintaa 1–20 px.
Valinta näkyy katkoviivana, ja **sivellin, tussi, pyyhekumi, täyttö, liukuväri, siirto ja poisto rajautuvat siihen**.
Valinnan teko on kumottavissa.

**Taikasauva ja täyttö** hakevat alueen valitusta lähteestä: *Alkuperäinen kuva* (maalauksen värialueet), *Aktiivinen taso* tai
*Viivatasot* (kaikki näkyvät tasot paitsi alkuperäinen, sopii värittämiseen ääriviivojen sisään). **Toleranssi** päättää, kuinka paljon väri saa poiketa.
Täytön **reunan laajennus** ulottaa täytön viivojen alle, ettei viivan ja värin väliin jää rakoa. Täyttö menee aktiiviselle rasteritasolle;
alkuperäisellä tai vektoritasolla se luo uuden tason. Ihanteellinen väritystapa: tee uusi taso ääriviivojen alle ja täytä sinne.

**Valinnan kopio, leikkaus ja poisto:** *Kopioi uudelle tasolle* (Ctrl+J, toimii myös alkuperäisestä kuvasta), *Leikkaa uudelle tasolle*,
*Poista sisältö* (Delete), *Täytä värillä* (Alt+Backspace).

**Siirrä (V):** valinnan pikselit siirtyvät (valinta seuraa), ilman valintaa koko tason sisältö. Vektorikohde siirtyy kokonaan.
Alkuperäistä kuvaa ei voi siirtää (kopioi ensin valinta uudelle tasolle).

**Muunnos (T):** laatikko tason sisällön (tai valinnan) ympärille. Kulmakahvat skaalaavat (oletuksena mittasuhteet säilyvät, Shift kääntää
tämän), reunakahvat venyttävät yhtä suuntaa, pallukka kiertää (Shift = 15° askelin), sisältä siirretään. *Peilaa* ja *Kierrä 90°* ovat omat nappinsa.
**Enter / Käytä** hyväksyy, **Esc / Peru** peruu, ja Ctrl+Z kesken muunnoksen peruu sen. Toimii myös vektorikohteille (pisteet ja kahvat muuntuvat).

**Rajaus (C):** vedä kulmia tai reunoja, tai siirrä aluetta sisältä. Mittasuhde valittavissa (vapaa, 1:1, 4:3, 3:2, 16:9 ja pystyt). Rajaus koskee kaikkia
tasoja, myös vektoriviivoja. Rajaus on kumottavissa.

Siirrossa ja muunnoksessa kankaan ulkopuolelle joutuva osa leikkautuu pois, mutta kumoaminen palauttaa sen.

**Kopioi, leikkaa, liitä (Photoshop-tyyliin):**
- **Ctrl+C** kopioi valinnan (tai koko tason sisällön, jos valintaa ei ole), **Ctrl+X** leikkaa, **Ctrl+V** liittää **uudelle tasolle samaan kohtaan**.
  Kopio kirjoitetaan myös järjestelmän leikepöydälle (jos selain sallii), joten sen voi liittää muihin ohjelmiin.
- **Liittäminen muualta:** jos leikepöydällä on uudempi kuva (esim. kuvakaappaus), se liitetään uudelle tasolle keskelle
  (liian iso kuva pienennetään kankaaseen sopivaksi). Jos ohjelmaa ei ole vielä avattu kuvalla, kuva avataan uutena kuvana kuten ennen.
  Muuten liitetään ohjelman oma kopio.
- **Puhelimessa:** **Muokkaa**-valikko (yläpalkissa) sisältää Kopioi, Leikkaa, Liitä, Valitse kaikki, Poista valinta, Käännä valinta ja Kankaan koko.
  Valikon *Liitä* lukee järjestelmän leikepöydän (selain voi kysyä luvan) ja liittää muuten oman kopion.
- Alkuperäistä kuvaa voi kopioida mutta ei leikata (se on suojattu).

**Kankaan koko (Muokkaa → Kankaan koko, Ctrl+Alt+C):** uusi leveys ja korkeus pikseleinä, mittasuhteet halutessasi lukittuna,
**ankkuri** (3 × 3) kertoo mihin kohtaan vanha kuva jää, ja **tausta** (läpinäkyvä, valkoinen tai musta) täyttää uuden alueen alkuperäisessä kuvassa.
Muut tasot saavat uuden alueen läpinäkyvänä, ja vektorikohteet siirtyvät mukana. Pienennys rajaa kuvan ankkurin mukaan. Kumottavissa.
Kankaan koko on rajattu muistin takia (20 megapikseliä, puhelimessa 10).

**Rajaus kuvan ulkopuolelle:** rajaustyökalulla (C) rajauksen voi vetää kuvan ulkopuolelle (työkalu zoomaa näkymän hieman ulos, jotta tilaa on),
jolloin kangas suurenee ja uusi alue täytetään *Kuvan ulkopuolinen alue* -valinnan mukaan.

## Vaihe 5 – säädöt ja suotimet ✅

**Säädöt-valikko** (yläpalkissa) toimii aktiiviselle rasteritasolle tai valinnalle. Esikatselu päivittyy liukusäädintä vedettäessä
(isoilla kuvilla kevennettynä), ja täysi tarkkuus lasketaan, kun painat **Käytä** (Enter). **Peru** (Esc) hylkää. Kaikki on kumottavissa.

| Säätö | Kuvaus |
| --- | --- |
| Kirkkaus / kontrasti | −100…100 |
| Sävy / kylläisyys (Ctrl+U) | sävy, kylläisyys ja vaaleus |
| Levels (Ctrl+L) | histogrammi, tulon musta/valkoinen, keskisävy (gamma), lähdön rajat, kanavat RGB/R/G/B, *Automaattinen* |
| Käyrät (Ctrl+M) | napauta käyrää lisätäksesi pisteen, raahaa, kaksoisnapautus poistaa; kanavat RGB/R/G/B |
| Mustavalkoinen | heti |
| Käänteiset värit (Ctrl+I) | heti |
| Sumennus | säde 0,5–60 px |
| Terävöinti | määrä, säde ja kynnys (unsharp mask) |

- **Alkuperäistäkin saa säätää.** Silloin tekoälyn analyysi tehdään uudestaan säädetystä kuvasta. Kumoaminen palauttaa kuvan.
- Säädöt eivät toimi vektorikohteille. Niiden värin ja paksuuden säädät Vektoriviiva-osiosta.
- Selain voi ottaa osan pikanäppäimistä (esim. Ctrl+L, Ctrl+U) omaan käyttöönsä. Valikko toimii aina.

**Ääriviivatyylit** (napit Vektoriviiva-osiossa):
- **Ohut tussi:** ohut, tarkka musta viiva.
- **Paksu sarjakuva:** paksu, puhdas musta viiva.
- **Lyijykynä:** ohut tummanharmaa viiva, joka katkeilee kahdella hieman eri kierroksella.
- Tyylit asettavat viivan paksuuden ja värin, ja niitä voi hienosäätää Viivan paksuus- ja Viivan väri -säätimillä.
- Tyyli menee valitulle kohteelle, tai **Tyyli kaikille kohteille** -napilla kaikille. Kumottavissa.

**Pipetti (I):** napauta tai raahaa kuvassa. Väri tulee siveltimen, täytön ja liukuvärin väriksi. Lähde: alkuperäinen kuva (oletus, oikeat värit maalauksesta),
aktiivinen taso tai näkyvä kuva; näyte yksi piste, 3 × 3 tai 5 × 5 keskiarvo. **Alt-klikkaus** poimii värin myös siveltimellä, tussilla, täytöllä ja liukuvärillä.

**Oma paletti:** siveltimen, vektoriviivan ja pipetin väriosioissa on paletti. Napauta väriä käyttääksesi sitä, **+ Lisää väri** tallentaa nykyisen värin
ja **Poista väri** -tilassa väri poistuu napauttamalla. Paletti tallentuu selaimeen (samalla koneella ja selaimella se säilyy).

## Vaihe 6 – vienti ja tallennus ✅

**Vie kuva** (yläpalkin **Vie**-painike tai Ctrl+E) avaa vientiikkunan. Valinnat muistetaan seuraavaa kertaa varten.

| Mitä viedään | Kuvaus |
| --- | --- |
| **Maalaus ja ääriviivat yhtenä kuvana** (oletus) | Alkuperäinen kuva täydellä näkyvyydellä (vaikka olisit himmentänyt sen), sen päällä vektoriviivat ja kaikki piirtämäsi näkyvät tasot. |
| **Pelkät ääriviivat** | Kaikki näkyvät tasot ilman alkuperäistä kuvaa. Tausta läpinäkyvä, valkoinen, musta tai oma väri. |
| **Kohteen leikkaus** | Rajattu kohde (esim. härkä) alkuperäisen kuvan pikseleillä. Kohteeksi käy tekoälyn vektorikohde, kaikki näkyvät kohteet yhdessä tai nykyinen valinta. Voi rajata kohteen reunoihin, lisätä kohteen ääriviivan ja valita taustan. |

- **Koko:** *Alkuperäinen koko* (jos kuva on pienennetty avatessa), työkoko tai puolet. Alkuperäisessä koossa vektoriääriviivat skaalautuvat tarkasti, ja alkuperäiseen tehdyt rajaukset ja säädöt toistetaan täysikokoiselle kuvalle. Se voi kestää hetken, ja isoille kuville on muistiraja (puhelimessa pienempi).
- **Muoto:** PNG, JPG (laatu säädettävissä; läpinäkyvä tausta muuttuu valkoiseksi) tai **SVG** (vain vektoriääriviivat, eli kynällä ja tekoälyllä tehdyt viivat; ei sivellinjälkiä).
- **Vektorikohteesta valinta:** Vektoriviiva-osion **Valinta kohteesta** tekee kohteen alueesta valinnan (Shift = lisää). Sen jälkeen Ctrl+J kopioi kohteen **alkuperäisestä kuvasta** uudelle tasolle, jolloin siirto, muunnos ja säädöt toimivat sille.

**Projekti (Tiedosto-valikko):** **Tallenna projekti** (Ctrl+S) ja **Tallenna nimellä** (Ctrl+Shift+S) tallentavat `.lineo`-tiedoston, jossa ovat kaikki tasot (pikselit, vektorit, nimet, näkyvyys, läpinäkyvyys, lukitus), viivojen tyylit, paletti sekä
isoilla kuvilla alkuperäinen tiedosto. Avaa se **Avaa kuva tai projekti** -toiminnolla (Ctrl+O), raahaamalla ikkunaan tai asennetussa sovelluksessa tuplaklikkaamalla tiedostoa.
- Chromessa ja Edgessä tallennus tapahtuu suoraan samaan tiedostoon (ensimmäisellä kerralla kysytään paikka). Muissa selaimissa (Safari, Firefox, iPhone) tiedosto ladataan Lataukset-kansioon aina, kun tallennat.
- Tiedostonimessä näkyy •, kun tallentamattomia muutoksia on. Sivua ei voi sulkea vahingossa tai toista kuvaa avata ilman varoitusta.
- Kumoamishistoria ei tallennu projektiin.
- **Paletti:** *Vie paletti* / *Tuo paletti* (JSON) siirtää värit koneelta toiselle. Projekti tuo oman palettinsa mukanaan ja yhdistää sen nykyiseen.

**Uusi (Tiedosto → Uusi, Ctrl+Alt+N):** palaa tyhjään aloitusnäkymään, josta voi avata uuden kuvan tai projektin ilman sovelluksen sulkemista. Jos tallentamattomia muutoksia on, ohjelma kysyy ensin. (Myös **Avaa kuva** korvaa nykyisen kuvan, samalla varoituksella.)

**Pikanäppäimet:** paina **?** (tai F1, tai Tiedosto → Pikanäppäimet) nähdäksesi kaikki. Photoshop-tyyliset: B sivellin, E pyyhekumi, V siirrä, P pisteet, M/L valinnat, I pipetti, T muunnos, C rajaus, G liukuväri, K täyttö, X vaihtaa värit, D oletusvärit, Ctrl+Z kumoa ja niin edelleen.

## Tulossa

Kaikki suunnitelman vaiheet on tehty. Mahdollisia jatkoja: säätötasot (ei-tuhoavat säädöt), historian tallennus projektiin, automaattitallennus.

## Yhteinen tyyli

Kansio `shared/` sisältää ohjelman yleisen ulkoasun ja logon:

- `shared/lineo-theme.css`: värit, typografia, painikkeet, paneelit, liukusäätimet, tilarivi, ilmoitukset
- `shared/lineo-logo.svg`: Lineo-logo (favicon / erillinen kuvatiedosto)

Korostusväri valitaan `data-lineo-app`-attribuutilla:

```html
<link rel="stylesheet" href="shared/lineo-theme.css">
<body class="lineo-app" data-lineo-app="photo">   <!-- photo = oranssi, motion = violetti, galleria = turkoosi -->
```

Logo on upotettu HTML:ään (katso `index.html`, `.lineo-brand`), jolloin viivan päätepiste
saa automaattisesti korostusvärin.

## Rakenne

```
index.html          sovelluksen runko
css/app.css         Lineon asettelu
js/i18n.js          käyttöliittymän tekstit (suomi ja englanti) ja kielivalinta
js/app.js           käyttöliittymä, tasot, näkymä, vienti
js/brush.js         sivellin, tussi ja pyyhekumi (leimaus, stabilointi, pehmeä kärki)
js/select.js        valintojen laskenta (maskit, yhdistäminen, taikasauvan alue, reuna)
js/filters.js       säädöt ja suotimet (kirkkaus, levels, käyrät, sumennus, terävöinti, lyijykynän rae)
js/files.js         projektitiedosto (.lineo) ja SVG-vienti
js/edge-core.js     reunantunnistus vanhojen projektien automaattisille ääriviivoille (Web Worker)
js/vector.js        maski → vektoriääriviiva, Bézier-polkujen muokkaus, värialueen rajaus
js/sam.js           tekoälyrajaus (Segment Anything, transformers.js Web Workerissa)
shared/             yhteinen tyyli ja logo
manifest.json       PWA-määrittely (nimi, värit, kuvakkeet)
sw.js               service worker: välimuisti ja toiminta ilman verkkoa
icons/              sovelluskuvakkeet (192/512, maskable, apple-touch-icon) ja niiden SVG-lähteet
```
