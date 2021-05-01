import test from 'ava'

import {loadMealsFromSource} from '../source/crawler/source.js'

const source = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="title" content="Speisepläne - Studierendenwerk Hamburg" />
    <title>Speisepläne - Studierendenwerk Hamburg</title>

    <link rel="shortcut icon" href="/favicon.ico" />
    <link rel="stylesheet" type="text/css" media="all" href="/css/main.css" />
<link rel="stylesheet" type="text/css" media="print" href="/css/print.css" />
  </head>
  <body>

    <div id="plan-page">
  <div id="plan">
    <div id="header">

      <a id="logo" href="http://www.studierendenwerk-hamburg.de/studierendenwerk/de/home/" title="Speisepläne">
        <img src="/images/logo_speiseplan.png" title="" alt="Logo von " />
      </a>
              <img id="image" src="/uploads/header/8a9ca74699d8e63ba96998063d5b5f81ee10f9e5.jpg" title="" alt="" />
            <div id="cafeteria">
        <h1>Café Berliner Tor</h1>
        <p>Berliner Tor 7
<br />20099 Hamburg
<br />Mo - Do 7.45 - 18.00 Uhr
<br />Fr 7.45 - 17.00 Uhr
<br />Mittagessen 11.15 Uhr - 14.30 Uhr</p><p></p>              </div>
    </div>
    <div class="clear"></div>


                <table id="week-menu">
        <caption></caption>
        <thead>
          <tr>
            <th class="category">
              Wochenplan:                              <br />06.01.2020 - 10.01.2020                          </th>
            <th class="day">Montag</th>
            <th class="day">Dienstag</th>
            <th class="day">Mittwoch</th>
            <th class="day">Donnerstag</th>
            <th class="day">Freitag</th>
          </tr>
        </thead>
        <tbody>


                      <tr class="odd">
              <th class="category">Gut und günstig</th>
                              <td class="day">
                                                                                                                                                                                                                                                                          </td>
                              <td class="day">
                                                                                                                                                                                                                                                                          </td>
                              <td class="day">

                                                <p class="dish ">
                                                      <strong>Hamburger Schmorkohl mit Rinderhack <strong> (<span class=tooltip title=Sellerie/-erzeugnisse>Sl</span>) </strong>, Salzkartoffeln</strong><br />
                                                        <span class="price">2,50 € / 3,80 € / 4,75 €</span>

                            <br />


                                                                                                                                <img src="/uploads/icons/a77e0a40d4ef2cdce578538758710c9c59548207.png" width="20" height="17" title="enthält keine laktosehaltigen Lebensmittel" alt="enthält keine laktosehaltigen Lebensmittel" />


                                                                                                                                <img src="/uploads/icons/e9a8e409409cf3ff7a40855d08e89097d6168e29.png" width="20" height="17" title="mit Rind" alt="mit Rind" />



                                                                              </p>
                                                                                                                                                                                                                                    </td>
                              <td class="day">
                                                                                                                                                                                                                                                                          </td>
                              <td class="day">
                                                                                                                                                                                                                                                                          </td>
                          </tr>
                                  <tr class="even">
              <th class="category">Beliebt und gerne gegessen</th>
                              <td class="day">
                                                                                                                                                                                                                                                                          </td>
                              <td class="day">
                                                                                                                                                                                                                                                                          </td>
                              <td class="day">
                                                                                                                                                                                                                                                                          </td>
                              <td class="day">
                                                                                                                                                                                                                                                                          </td>
                              <td class="day">

                                                <p class="dish ">
                                                      <strong>Hähnchenbrust in Kardamommarinade <strong> (<span class=tooltip title=Soja/-erzeugnisse>So</span>) </strong>, Tomaten Paprika Apfelgemüse mit Bambusstreifen <strong> (<span class=tooltip title=Schwefeldioxid/Sulfite>Sw</span>) </strong>, Basmatireis</strong><br />
                                                        <span class="price">2,80 € / 4,10 € / 5,15 €</span>

                            <br />


                                                                                                                                <img src="/uploads/icons/a77e0a40d4ef2cdce578538758710c9c59548207.png" width="20" height="17" title="enthält keine laktosehaltigen Lebensmittel" alt="enthält keine laktosehaltigen Lebensmittel" />


                                                                                                                                <img src="/uploads/icons/636506d11657da1d9d85fc04e0230ab111954912.png" width="20" height="17" title="mit Geflügel" alt="mit Geflügel" />



                                                                              </p>
                                                                                                                                                                                              </td>
                          </tr>
                                  <tr class="odd">
              <th class="category">Campus Spezial</th>
                              <td class="day">

                                                <p class="dish ">
                                                      <strong>Putensteak, Kräuterbutter <strong> (<span class=tooltip title=Milch/-erzeugnisse (einschl. Laktose)>La</span>) </strong>, Broccoli, Tomaten-Gnocchi <strong> (<span class=tooltip title=Glutenhaltiges Getreide und daraus hergestellte Erzeugnissse>Gl</span>, <span class=tooltip title=Ei/-erzeugnisse>Ei</span>) </strong></strong><br />
                                                        <span class="price">4,95 € / 5,95 € / 7,45 €</span>

                            <br />


                                                                                                                                <img src="/uploads/icons/636506d11657da1d9d85fc04e0230ab111954912.png" width="20" height="17" title="mit Geflügel" alt="mit Geflügel" />



                                                                              </p>
                                                                                                                                                        </td>
                              <td class="day">

                                                <p class="dish ">
                                                      <strong>Susländer Nackenbraten, Biersoße <strong> (<span class=tooltip title=Glutenhaltiges Getreide und daraus hergestellte Erzeugnissse>Gl</span>, <span class=tooltip title=Sellerie/-erzeugnisse>Sl</span>) </strong>, Spitzkohl, Semmelklöße <strong> (<span class=tooltip title=Glutenhaltiges Getreide und daraus hergestellte Erzeugnissse>Gl</span>, <span class=tooltip title=Ei/-erzeugnisse>Ei</span>) </strong></strong><br />
                                                        <span class="price">4,30 € / 5,30 € / 6,65 €</span>

                            <br />


                                                                                                                                <img src="/uploads/icons/a77e0a40d4ef2cdce578538758710c9c59548207.png" width="20" height="17" title="enthält keine laktosehaltigen Lebensmittel" alt="enthält keine laktosehaltigen Lebensmittel" />


                                                                                                                                <img src="/uploads/icons/74187548f2da18c6dd641f5e8a50c23d7a66e974.png" width="20" height="17" title="mit Alkohol" alt="mit Alkohol" />


                                                                                                                                <img src="/uploads/icons/605801019ea63cf45702f2a2beb9cb9fc64b6b07.png" width="20" height="17" title="mit Schwein" alt="mit Schwein" />



                                                                              </p>
                                                                                                                  </td>
                              <td class="day">
                                                                                                                                                                                                                                                                          </td>
                              <td class="day">

                                                <p class="dish ">
                                                      <strong>Grünkohl <strong> (<span class=tooltip title=Konservierungsstoffe>2</span>, <span class=tooltip title=Antioxidationsmittel>3</span>, <span class=tooltip title=Phosphat>8</span>, <span class=tooltip title=Senf/-erzeugnisse>Sf</span>) </strong>, Kochwurst <strong> (<span class=tooltip title=Konservierungsstoffe>2</span>, <span class=tooltip title=Antioxidationsmittel>3</span>, <span class=tooltip title=Geschmacksverstärker>4</span>, <span class=tooltip title=Phosphat>8</span>, <span class=tooltip title=Senf/-erzeugnisse>Sf</span>) </strong>, Röstkartoffeln</strong><br />
                                                        <span class="price">4,30 € / 5,30 € / 6,55 €</span>

                            <br />


                                                                                                                                <img src="/uploads/icons/a77e0a40d4ef2cdce578538758710c9c59548207.png" width="20" height="17" title="enthält keine laktosehaltigen Lebensmittel" alt="enthält keine laktosehaltigen Lebensmittel" />


                                                                                                                                <img src="/uploads/icons/e9a8e409409cf3ff7a40855d08e89097d6168e29.png" width="20" height="17" title="mit Rind" alt="mit Rind" />


                                                                                                                                <img src="/uploads/icons/605801019ea63cf45702f2a2beb9cb9fc64b6b07.png" width="20" height="17" title="mit Schwein" alt="mit Schwein" />



                                                                              </p>
                                                                            </td>
                              <td class="day">
                                                                                                                                                                                                                                                                          </td>
                          </tr>
                              </tbody>
      </table>


  </div>




      <div id="advices">
            <p>• Änderungen des Speiseplans vorbehalten.<br />
• Wir sind als gemeinnütziges Unternehmen verpflichtet, die Nutzungsberechtigung der Studierenden regelmäßig zu überprüfen und bitten Sie daher, den Studierendenausweis immer mitzuführen.<br />
•Wir kennzeichnen die Allergene entsprechend der EU-Lebensmittelinformationsverordnung  Nr. 1169/2011. Kreuzkontaminationen bei den einzelnen Zutaten sowie technologisch unvermeidbare Verunreinigungen einzelner Produkte mit Allergenen können nicht ausgeschlossen werden und werden nicht gekennzeichnet. <br />
• Die verschiedenen Preise sind jeweils gültig für Studierende/Bedienstete/Gäste.</p>
    </div>


  <h2>Zusatzstoffe/Allergene</h2>
    <ul class="additives">

        <li>2 = Konservierungsstoffe</li>



        <li>3 = Antioxidationsmittel</li>



        <li>4 = Geschmacksverstärker</li>



        <li>8 = Phosphat</li>



        <li>Sl = Sellerie/-erzeugnisse</li>

                  </ul><ul class="additives">


        <li>Gl = Glutenhaltiges Getreide und daraus hergestellte Erzeugnissse</li>



        <li>La = Milch/-erzeugnisse (einschl. Laktose)</li>



        <li>Ei = Ei/-erzeugnisse</li>



        <li>So = Soja/-erzeugnisse</li>



        <li>Sf = Senf/-erzeugnisse</li>

                  </ul><ul class="additives">


        <li>Sw = Schwefeldioxid/Sulfite</li>


                                                                                          </ul>


  <br class="clear" />

  <ul class="clear" id="additioncategories">
                                                                                                      <li>
                  <img src="/uploads/icons/74187548f2da18c6dd641f5e8a50c23d7a66e974.png" title="mit Alkohol" alt="mit Alkohol" />
                <br />
        mit Alkohol      </li>
                  <li>
                  <img src="/uploads/icons/605801019ea63cf45702f2a2beb9cb9fc64b6b07.png" title="mit Schwein" alt="mit Schwein" />
                <br />
        mit Schwein      </li>
                  <li>
                  <img src="/uploads/icons/e9a8e409409cf3ff7a40855d08e89097d6168e29.png" title="mit Rind" alt="mit Rind" />
                <br />
        mit Rind      </li>
                          <li>
                  <img src="/uploads/icons/636506d11657da1d9d85fc04e0230ab111954912.png" title="mit Geflügel" alt="mit Geflügel" />
                <br />
        mit Geflügel      </li>
                                                  <li>
                  <img src="/uploads/icons/a77e0a40d4ef2cdce578538758710c9c59548207.png" title="enthält keine laktosehaltigen Lebensmittel" alt="enthält keine laktosehaltigen Lebensmittel" />
                <br />
        enthält keine laktosehaltigen Lebensmittel      </li>
                                                                  </ul>


</div>    <script type="text/javascript" src="/js/jquery.min.js"></script>
<script type="text/javascript" src="/js/script.js"></script>
    <!-- Piwik -->
    <script type="text/javascript">
      var pkBaseURL = (("https:" == document.location.protocol) ? "https://piwik.studierendenwerk-hamburg.de/" : "http://piwik.studierendenwerk-hamburg.de/");
      document.write(unescape("%3Cscript src='" + pkBaseURL + "piwik.js' type='text/javascript'%3E%3C/script%3E"));
    </script>
    <script type="text/javascript">
      try {
      var piwikTracker = Piwik.getTracker(pkBaseURL + "piwik.php", 1);
      piwikTracker.trackPageView();
      piwikTracker.enableLinkTracking();
      } catch( err ) {}
    </script><noscript><p><img src="http://piwik.studierendenwerk-hamburg.de/piwik.php?idsite=1" style="border:0" alt="" /></p></noscript>
    <!-- End Piwik Tracking Code -->
  </body>
</html>
`

test('example', t => {
	const meals = loadMealsFromSource(source)
	t.deepEqual(meals, [
		{
			Name: 'Hamburger Schmorkohl mit Rinderhack (Sl), Salzkartoffeln',
			Category: 'Gut und günstig',
			Date: '2020-01-08T00:00:00.000Z',
			Additives: {
				Sl: 'Sellerie/-erzeugnisse'
			},
			PriceStudent: 2.5,
			PriceAttendant: 3.8,
			PriceGuest: 4.75,
			Alcohol: false,
			Beef: true,
			LactoseFree: true,
			Poultry: false,
			Fish: false,
			Vegan: false,
			Vegetarian: false,
			Pig: false
		}, {
			Name: 'Hähnchenbrust in Kardamommarinade (So), Tomaten Paprika Apfelgemüse mit Bambusstreifen (Sw), Basmatireis',
			Category: 'Beliebt und gerne gegessen',
			Date: '2020-01-10T00:00:00.000Z',
			Additives: {
				So: 'Soja/-erzeugnisse',
				Sw: 'Schwefeldioxid/Sulfite'
			},
			PriceStudent: 2.8,
			PriceAttendant: 4.1,
			PriceGuest: 5.15,
			Alcohol: false,
			Beef: false,
			Fish: false,
			LactoseFree: true,
			Pig: false,
			Poultry: true,
			Vegan: false,
			Vegetarian: false
		}, {
			Name: 'Putensteak, Kräuterbutter (La), Broccoli, Tomaten-Gnocchi (Gl, Ei)',
			Category: 'Campus Spezial',
			Date: '2020-01-06T00:00:00.000Z',
			Additives: {
				Ei: 'Ei/-erzeugnisse',
				Gl: 'Glutenhaltiges Getreide und daraus hergestellte Erzeugnissse',
				La: 'Milch/-erzeugnisse (einschl. Laktose)'
			},
			PriceStudent: 4.95,
			PriceAttendant: 5.95,
			PriceGuest: 7.45,
			Alcohol: false,
			Beef: false,
			Fish: false,
			LactoseFree: false,
			Pig: false,
			Poultry: true,
			Vegan: false,
			Vegetarian: false
		}, {
			Name: 'Susländer Nackenbraten, Biersoße (Gl, Sl), Spitzkohl, Semmelklöße (Gl, Ei)',
			Category: 'Campus Spezial',
			Date: '2020-01-07T00:00:00.000Z',
			Additives: {
				Ei: 'Ei/-erzeugnisse',
				Gl: 'Glutenhaltiges Getreide und daraus hergestellte Erzeugnissse',
				Sl: 'Sellerie/-erzeugnisse'
			},
			PriceStudent: 4.3,
			PriceAttendant: 5.3,
			PriceGuest: 6.65,
			Alcohol: true,
			Beef: false,
			Fish: false,
			LactoseFree: true,
			Pig: true,
			Poultry: false,
			Vegan: false,
			Vegetarian: false
		}, {
			Name: 'Grünkohl (2, 3, 8, Sf), Kochwurst (2, 3, 4, 8, Sf), Röstkartoffeln',
			Category: 'Campus Spezial',
			Date: '2020-01-09T00:00:00.000Z',
			Additives: {
				2: 'Konservierungsstoffe',
				3: 'Antioxidationsmittel',
				4: 'Geschmacksverstärker',
				8: 'Phosphat',
				Sf: 'Senf/-erzeugnisse'
			},
			PriceStudent: 4.3,
			PriceAttendant: 5.3,
			PriceGuest: 6.55,
			Alcohol: false,
			Beef: true,
			Fish: false,
			LactoseFree: true,
			Pig: true,
			Poultry: false,
			Vegan: false,
			Vegetarian: false
		}
	])
})
