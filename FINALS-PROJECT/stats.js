// =====================================================================
// combined.js — DATA SCIENCE COLLABORATIVE GIT PROJECT
// Merged from datasets.js (Student 1) + stats.js (Student 2)
//
// Load order inside this single file:
//   1.  RAW_DATA constant  ................. feat: define RAW_DATA constant
//   2.  EMBEDDED_DATASETS + window.DS ...... feat: expose dataset registry
//   3.  loadDataset()  ..................... feat: implement loadDataset()       [Task A]
//   4.  renderTable()  ..................... feat: implement renderTable()       [Task B]
//   5.  applyFilterSort()  ................. feat: implement applyFilterSort()  [Task C]
//   6.  resetTable()  ...................... feat: implement resetTable()        [Task D]
//   7.  renderSummaryCards()  .............. feat: implement renderSummaryCards()[Task E]
//   8.  Stats engine (Student 2) ........... all analytics, charts, explorer
//   9.  DOMContentLoaded bootstrap ......... auto-load on page open
// =====================================================================

// =====================================================================
// datasets.js — Student 1's portion
// DATA SCIENCE COLLABORATIVE GIT PROJECT — 2-STUDENT EDITION
//
// Commit history mapping:
//   feat: define RAW_DATA constant with EdStats samples
//   feat: implement loadDataset() — Task A
//   feat: implement renderTable() — Task B
//   feat: implement applyFilterSort() — Task C
//   feat: implement resetTable() — Task D
//   feat: implement renderSummaryCards() — Task E
// =====================================================================

// ── RAW_DATA ─────────────────────────────────────────────────────────
// Hardcoded representative samples from all five EdStats CSV files.
// Each sub-key matches the original filename (without extension).
const RAW_DATA = {"EdStatsCountry":[{"Country Code":"ABW","Short Name":"Aruba","Region":"Latin America & Caribbean","Income Group":"High income: nonOECD","Lending category":"","Currency Unit":"Aruban florin","Vital registration complete":"Yes","Latest population census":"2010"},{"Country Code":"AFG","Short Name":"Afghanistan","Region":"South Asia","Income Group":"Low income","Lending category":"IDA","Currency Unit":"Afghan afghani","Vital registration complete":"","Latest population census":"1979"},{"Country Code":"AGO","Short Name":"Angola","Region":"Sub-Saharan Africa","Income Group":"Upper middle income","Lending category":"IBRD","Currency Unit":"Angolan kwanza","Vital registration complete":"","Latest population census":"1970"},{"Country Code":"ALB","Short Name":"Albania","Region":"Europe & Central Asia","Income Group":"Upper middle income","Lending category":"IBRD","Currency Unit":"Albanian lek","Vital registration complete":"Yes","Latest population census":"2011"},{"Country Code":"AND","Short Name":"Andorra","Region":"Europe & Central Asia","Income Group":"High income: nonOECD","Lending category":"","Currency Unit":"Euro","Vital registration complete":"Yes","Latest population census":"2011. Population figures compiled from administrative registers."},{"Country Code":"ARB","Short Name":"Arab World","Region":"","Income Group":"","Lending category":"","Currency Unit":"","Vital registration complete":"","Latest population census":""},{"Country Code":"ARE","Short Name":"United Arab Emirates","Region":"Middle East & North Africa","Income Group":"High income: nonOECD","Lending category":"","Currency Unit":"U.A.E. dirham","Vital registration complete":"","Latest population census":"2010"},{"Country Code":"ARG","Short Name":"Argentina","Region":"Latin America & Caribbean","Income Group":"Upper middle income","Lending category":"IBRD","Currency Unit":"Argentine peso","Vital registration complete":"Yes","Latest population census":"2010"},{"Country Code":"ARM","Short Name":"Armenia","Region":"Europe & Central Asia","Income Group":"Lower middle income","Lending category":"IBRD","Currency Unit":"Armenian dram","Vital registration complete":"Yes","Latest population census":"2011"},{"Country Code":"ASM","Short Name":"American Samoa","Region":"East Asia & Pacific","Income Group":"Upper middle income","Lending category":"","Currency Unit":"U.S. dollar","Vital registration complete":"Yes","Latest population census":"2010"},{"Country Code":"ATG","Short Name":"Antigua and Barbuda","Region":"Latin America & Caribbean","Income Group":"High income: nonOECD","Lending category":"IBRD","Currency Unit":"East Caribbean dollar","Vital registration complete":"Yes","Latest population census":"2011"},{"Country Code":"AUS","Short Name":"Australia","Region":"East Asia & Pacific","Income Group":"High income: OECD","Lending category":"","Currency Unit":"Australian dollar","Vital registration complete":"Yes","Latest population census":"2011"},{"Country Code":"AUT","Short Name":"Austria","Region":"Europe & Central Asia","Income Group":"High income: OECD","Lending category":"","Currency Unit":"Euro","Vital registration complete":"Yes","Latest population census":"2011. Population figures compiled from administrative registers."},{"Country Code":"AZE","Short Name":"Azerbaijan","Region":"Europe & Central Asia","Income Group":"Upper middle income","Lending category":"IBRD","Currency Unit":"New Azeri manat","Vital registration complete":"Yes","Latest population census":"2009"},{"Country Code":"BDI","Short Name":"Burundi","Region":"Sub-Saharan Africa","Income Group":"Low income","Lending category":"IDA","Currency Unit":"Burundi franc","Vital registration complete":"","Latest population census":"2008"},{"Country Code":"BEL","Short Name":"Belgium","Region":"Europe & Central Asia","Income Group":"High income: OECD","Lending category":"","Currency Unit":"Euro","Vital registration complete":"Yes","Latest population census":"2011"},{"Country Code":"BEN","Short Name":"Benin","Region":"Sub-Saharan Africa","Income Group":"Low income","Lending category":"IDA","Currency Unit":"CFA franc","Vital registration complete":"","Latest population census":"2013"},{"Country Code":"BFA","Short Name":"Burkina Faso","Region":"Sub-Saharan Africa","Income Group":"Low income","Lending category":"IDA","Currency Unit":"CFA franc","Vital registration complete":"","Latest population census":"2006"},{"Country Code":"BGD","Short Name":"Bangladesh","Region":"South Asia","Income Group":"Low income","Lending category":"IDA","Currency Unit":"Bangladeshi taka","Vital registration complete":"","Latest population census":"2011"},{"Country Code":"BGR","Short Name":"Bulgaria","Region":"Europe & Central Asia","Income Group":"Upper middle income","Lending category":"IBRD","Currency Unit":"Bulgarian lev","Vital registration complete":"Yes","Latest population census":"2011"},{"Country Code":"BHR","Short Name":"Bahrain","Region":"Middle East & North Africa","Income Group":"High income: nonOECD","Lending category":"","Currency Unit":"Bahraini dinar","Vital registration complete":"Yes","Latest population census":"2010"},{"Country Code":"BHS","Short Name":"The Bahamas","Region":"Latin America & Caribbean","Income Group":"High income: nonOECD","Lending category":"","Currency Unit":"Bahamian dollar","Vital registration complete":"","Latest population census":"2010"},{"Country Code":"BIH","Short Name":"Bosnia and Herzegovina","Region":"Europe & Central Asia","Income Group":"Upper middle income","Lending category":"IBRD","Currency Unit":"Bosnia and Herzegovina convertible mark","Vital registration complete":"Yes","Latest population census":"2013"},{"Country Code":"BLR","Short Name":"Belarus","Region":"Europe & Central Asia","Income Group":"Upper middle income","Lending category":"IBRD","Currency Unit":"Belarusian rubel","Vital registration complete":"Yes","Latest population census":"2009"},{"Country Code":"BLZ","Short Name":"Belize","Region":"Latin America & Caribbean","Income Group":"Upper middle income","Lending category":"IBRD","Currency Unit":"Belize dollar","Vital registration complete":"","Latest population census":"2010"},{"Country Code":"BMU","Short Name":"Bermuda","Region":"North America","Income Group":"High income: nonOECD","Lending category":"","Currency Unit":"Bermuda dollar","Vital registration complete":"Yes","Latest population census":"2010"},{"Country Code":"BOL","Short Name":"Bolivia","Region":"Latin America & Caribbean","Income Group":"Lower middle income","Lending category":"Blend","Currency Unit":"Bolivian Boliviano","Vital registration complete":"","Latest population census":"2012"},{"Country Code":"BRA","Short Name":"Brazil","Region":"Latin America & Caribbean","Income Group":"Upper middle income","Lending category":"IBRD","Currency Unit":"Brazilian real","Vital registration complete":"","Latest population census":"2010"},{"Country Code":"BRB","Short Name":"Barbados","Region":"Latin America & Caribbean","Income Group":"High income: nonOECD","Lending category":"","Currency Unit":"Barbados dollar","Vital registration complete":"Yes","Latest population census":"2010"},{"Country Code":"BRN","Short Name":"Brunei","Region":"East Asia & Pacific","Income Group":"High income: nonOECD","Lending category":"","Currency Unit":"Brunei dollar","Vital registration complete":"Yes","Latest population census":"2011"},{"Country Code":"BTN","Short Name":"Bhutan","Region":"South Asia","Income Group":"Lower middle income","Lending category":"IDA","Currency Unit":"Bhutanese ngultrum","Vital registration complete":"","Latest population census":"2005"},{"Country Code":"BWA","Short Name":"Botswana","Region":"Sub-Saharan Africa","Income Group":"Upper middle income","Lending category":"IBRD","Currency Unit":"Botswana pula","Vital registration complete":"","Latest population census":"2011"},{"Country Code":"CAF","Short Name":"Central African Republic","Region":"Sub-Saharan Africa","Income Group":"Low income","Lending category":"IDA","Currency Unit":"CFA franc","Vital registration complete":"","Latest population census":"2003"},{"Country Code":"CAN","Short Name":"Canada","Region":"North America","Income Group":"High income: OECD","Lending category":"","Currency Unit":"Canadian dollar","Vital registration complete":"Yes","Latest population census":"2011"},{"Country Code":"CHE","Short Name":"Switzerland","Region":"Europe & Central Asia","Income Group":"High income: OECD","Lending category":"","Currency Unit":"Swiss franc","Vital registration complete":"Yes","Latest population census":"2010"},{"Country Code":"CHI","Short Name":"Channel Islands","Region":"Europe & Central Asia","Income Group":"High income: nonOECD","Lending category":"","Currency Unit":"Pound sterling","Vital registration complete":"Yes. Vital registration for Guernsey and Jersey.","Latest population census":"Guernsey: 2009; Jersey: 2011."},{"Country Code":"CHL","Short Name":"Chile","Region":"Latin America & Caribbean","Income Group":"High income: OECD","Lending category":"IBRD","Currency Unit":"Chilean peso","Vital registration complete":"Yes","Latest population census":"2012"},{"Country Code":"CHN","Short Name":"China","Region":"East Asia & Pacific","Income Group":"Upper middle income","Lending category":"IBRD","Currency Unit":"Chinese yuan","Vital registration complete":"","Latest population census":"2010"},{"Country Code":"CIV","Short Name":"C\u00f4te d'Ivoire","Region":"Sub-Saharan Africa","Income Group":"Lower middle income","Lending category":"IDA","Currency Unit":"CFA franc","Vital registration complete":"","Latest population census":"1998"},{"Country Code":"CMR","Short Name":"Cameroon","Region":"Sub-Saharan Africa","Income Group":"Lower middle income","Lending category":"Blend","Currency Unit":"CFA franc","Vital registration complete":"","Latest population census":"2005"},{"Country Code":"COD","Short Name":"Dem. Rep. Congo","Region":"Sub-Saharan Africa","Income Group":"Low income","Lending category":"IDA","Currency Unit":"Congolese franc","Vital registration complete":"","Latest population census":"1984"},{"Country Code":"COG","Short Name":"Congo","Region":"Sub-Saharan Africa","Income Group":"Lower middle income","Lending category":"Blend","Currency Unit":"CFA franc","Vital registration complete":"","Latest population census":"2007"},{"Country Code":"COL","Short Name":"Colombia","Region":"Latin America & Caribbean","Income Group":"Upper middle income","Lending category":"IBRD","Currency Unit":"Colombian peso","Vital registration complete":"","Latest population census":"2006"},{"Country Code":"COM","Short Name":"Comoros","Region":"Sub-Saharan Africa","Income Group":"Low income","Lending category":"IDA","Currency Unit":"Comorian franc","Vital registration complete":"","Latest population census":"2003"},{"Country Code":"CPV","Short Name":"Cabo Verde","Region":"Sub-Saharan Africa","Income Group":"Lower middle income","Lending category":"Blend","Currency Unit":"Cabo Verde escudo","Vital registration complete":"Yes","Latest population census":"2010"},{"Country Code":"CRI","Short Name":"Costa Rica","Region":"Latin America & Caribbean","Income Group":"Upper middle income","Lending category":"IBRD","Currency Unit":"Costa Rican colon","Vital registration complete":"Yes","Latest population census":"2011"},{"Country Code":"CUB","Short Name":"Cuba","Region":"Latin America & Caribbean","Income Group":"Upper middle income","Lending category":"","Currency Unit":"Cuban peso","Vital registration complete":"Yes","Latest population census":"2012"},{"Country Code":"CUW","Short Name":"Cura\u00e7ao","Region":"Latin America & Caribbean","Income Group":"High income: nonOECD","Lending category":"","Currency Unit":"Netherlands Antilles guilder","Vital registration complete":"","Latest population census":""},{"Country Code":"CYM","Short Name":"Cayman Islands","Region":"Latin America & Caribbean","Income Group":"High income: nonOECD","Lending category":"","Currency Unit":"Cayman Islands dollar","Vital registration complete":"Yes","Latest population census":"2010"},{"Country Code":"CYP","Short Name":"Cyprus","Region":"Europe & Central Asia","Income Group":"High income: nonOECD","Lending category":"","Currency Unit":"Euro","Vital registration complete":"Yes","Latest population census":"2011"},{"Country Code":"CZE","Short Name":"Czech Republic","Region":"Europe & Central Asia","Income Group":"High income: OECD","Lending category":"","Currency Unit":"Czech koruna","Vital registration complete":"Yes","Latest population census":"2011"},{"Country Code":"DEU","Short Name":"Germany","Region":"Europe & Central Asia","Income Group":"High income: OECD","Lending category":"","Currency Unit":"Euro","Vital registration complete":"Yes","Latest population census":"2011"},{"Country Code":"DJI","Short Name":"Djibouti","Region":"Middle East & North Africa","Income Group":"Lower middle income","Lending category":"IDA","Currency Unit":"Djibouti franc","Vital registration complete":"","Latest population census":"2009"},{"Country Code":"DMA","Short Name":"Dominica","Region":"Latin America & Caribbean","Income Group":"Upper middle income","Lending category":"Blend","Currency Unit":"East Caribbean dollar","Vital registration complete":"Yes","Latest population census":"2011"},{"Country Code":"DNK","Short Name":"Denmark","Region":"Europe & Central Asia","Income Group":"High income: OECD","Lending category":"","Currency Unit":"Danish krone","Vital registration complete":"Yes","Latest population census":"2011"},{"Country Code":"DOM","Short Name":"Dominican Republic","Region":"Latin America & Caribbean","Income Group":"Upper middle income","Lending category":"IBRD","Currency Unit":"Dominican peso","Vital registration complete":"","Latest population census":"2010"},{"Country Code":"DZA","Short Name":"Algeria","Region":"Middle East & North Africa","Income Group":"Upper middle income","Lending category":"IBRD","Currency Unit":"Algerian dinar","Vital registration complete":"","Latest population census":"2008"},{"Country Code":"EAP","Short Name":"East Asia & Pacific (developing only)","Region":"","Income Group":"","Lending category":"","Currency Unit":"","Vital registration complete":"","Latest population census":""},{"Country Code":"EAS","Short Name":"East Asia & Pacific (all income levels)","Region":"","Income Group":"","Lending category":"","Currency Unit":"","Vital registration complete":"","Latest population census":""},{"Country Code":"ECA","Short Name":"Europe & Central Asia (developing only)","Region":"","Income Group":"","Lending category":"","Currency Unit":"","Vital registration complete":"","Latest population census":""}],"EdStatsCountry_Series":[{"CountryCode":"ABW","SeriesCode":"SP.POP.TOTL","DESCRIPTION":"Data sources : United Nations World Population Prospects"},{"CountryCode":"ABW","SeriesCode":"SP.POP.GROW","DESCRIPTION":"Data sources: United Nations World Population Prospects"},{"CountryCode":"AFG","SeriesCode":"SP.POP.GROW","DESCRIPTION":"Data sources: United Nations World Population Prospects"},{"CountryCode":"AFG","SeriesCode":"NY.GDP.PCAP.PP.CD","DESCRIPTION":"Estimates are based on regression."},{"CountryCode":"AFG","SeriesCode":"SP.POP.TOTL","DESCRIPTION":"Data sources : United Nations World Population Prospects"},{"CountryCode":"AFG","SeriesCode":"NY.GDP.MKTP.PP.KD","DESCRIPTION":"Estimates are based on regression."},{"CountryCode":"AFG","SeriesCode":"NY.GNP.MKTP.PP.CD","DESCRIPTION":"Estimates are based on regression."},{"CountryCode":"AFG","SeriesCode":"NY.GDP.MKTP.PP.CD","DESCRIPTION":"Estimates are based on regression."},{"CountryCode":"AFG","SeriesCode":"NY.GDP.PCAP.PP.KD","DESCRIPTION":"Estimates are based on regression."},{"CountryCode":"AFG","SeriesCode":"NY.GNP.PCAP.PP.CD","DESCRIPTION":"Estimates are based on regression."},{"CountryCode":"AGO","SeriesCode":"SP.POP.TOTL","DESCRIPTION":"Data sources : United Nations World Population Prospects"},{"CountryCode":"AGO","SeriesCode":"SP.POP.GROW","DESCRIPTION":"Data sources: United Nations World Population Prospects"},{"CountryCode":"ALB","SeriesCode":"SP.POP.GROW","DESCRIPTION":"Data sources: United Nations World Population Prospects"},{"CountryCode":"ALB","SeriesCode":"SP.POP.TOTL","DESCRIPTION":"Data sources : Institute of Statistics, Eurostat"},{"CountryCode":"AND","SeriesCode":"SP.POP.TOTL","DESCRIPTION":"Data sources : United Nations World Population Prospects"},{"CountryCode":"AND","SeriesCode":"SP.POP.GROW","DESCRIPTION":"Data sources: United Nations World Population Prospects"},{"CountryCode":"ARE","SeriesCode":"SP.POP.GROW","DESCRIPTION":"Data sources: United Nations World Population Prospects"},{"CountryCode":"ARE","SeriesCode":"SP.POP.TOTL","DESCRIPTION":"Data sources : United Nations World Population Prospects"},{"CountryCode":"ARG","SeriesCode":"NY.GDP.MKTP.PP.KD","DESCRIPTION":"Estimates are based on regression."},{"CountryCode":"ARG","SeriesCode":"NY.GNP.MKTP.PP.CD","DESCRIPTION":"Estimates are based on regression."},{"CountryCode":"ARG","SeriesCode":"NY.GDP.PCAP.PP.CD","DESCRIPTION":"Estimates are based on regression."},{"CountryCode":"ARG","SeriesCode":"SP.POP.TOTL","DESCRIPTION":"Data sources : United Nations World Population Prospects"},{"CountryCode":"ARG","SeriesCode":"NY.GNP.PCAP.PP.CD","DESCRIPTION":"Estimates are based on regression."},{"CountryCode":"ARG","SeriesCode":"NY.GDP.PCAP.PP.KD","DESCRIPTION":"Estimates are based on regression."},{"CountryCode":"ARG","SeriesCode":"SP.POP.GROW","DESCRIPTION":"Data sources: United Nations World Population Prospects"},{"CountryCode":"ARG","SeriesCode":"NY.GDP.MKTP.PP.CD","DESCRIPTION":"Estimates are based on regression."},{"CountryCode":"ARM","SeriesCode":"SP.POP.GROW","DESCRIPTION":"Data sources: United Nations World Population Prospects"},{"CountryCode":"ARM","SeriesCode":"SP.POP.TOTL","DESCRIPTION":"Data sources : United Nations World Population Prospects"},{"CountryCode":"ASM","SeriesCode":"SP.POP.TOTL","DESCRIPTION":"Data sources : United Nations World Population Prospects"},{"CountryCode":"ASM","SeriesCode":"SP.POP.GROW","DESCRIPTION":"Data sources: United Nations World Population Prospects"},{"CountryCode":"ATG","SeriesCode":"SP.POP.GROW","DESCRIPTION":"Data sources: United Nations World Population Prospects"},{"CountryCode":"ATG","SeriesCode":"SP.POP.TOTL","DESCRIPTION":"Data sources : United Nations World Population Prospects"},{"CountryCode":"AUS","SeriesCode":"SP.POP.TOTL","DESCRIPTION":"Data sources : Australian Bureau of Statistics"},{"CountryCode":"AUS","SeriesCode":"SP.POP.1564.TO.ZS","DESCRIPTION":"Including Other Territories comprising Jervis Bay Territory, Christmas Island and the Cocos (Keeling) Islands. "},{"CountryCode":"AUS","SeriesCode":"SP.POP.GROW","DESCRIPTION":"Data sources: Australian Bureau of Statistics"},{"CountryCode":"AUS","SeriesCode":"SP.POP.TOTL.MA.ZS","DESCRIPTION":"Including Other Territories comprising Jervis Bay Territory, Christmas Island and the Cocos (Keeling) Islands. "},{"CountryCode":"AUS","SeriesCode":"SP.POP.TOTL.FE.ZS","DESCRIPTION":"Including Other Territories comprising Jervis Bay Territory, Christmas Island and the Cocos (Keeling) Islands. "},{"CountryCode":"AUS","SeriesCode":"SP.POP.0014.TO.ZS","DESCRIPTION":"Including Other Territories comprising Jervis Bay Territory, Christmas Island and the Cocos (Keeling) Islands. "},{"CountryCode":"AUT","SeriesCode":"SP.POP.GROW","DESCRIPTION":"Data sources : Eurostat"},{"CountryCode":"AUT","SeriesCode":"SP.POP.TOTL","DESCRIPTION":"Data sources : Eurostat"},{"CountryCode":"AZE","SeriesCode":"SP.POP.TOTL","DESCRIPTION":"Data sources : Eurostat, State Statistical Committee, United Nations World Population Prospects"},{"CountryCode":"AZE","SeriesCode":"SP.POP.GROW","DESCRIPTION":"Data sources: Eurostat, State Statistical Committee, United Nations World Population Prospects"},{"CountryCode":"BDI","SeriesCode":"SP.POP.GROW","DESCRIPTION":"Data sources: United Nations World Population Prospects"},{"CountryCode":"BDI","SeriesCode":"SP.POP.TOTL","DESCRIPTION":"Data sources : United Nations World Population Prospects"},{"CountryCode":"BEL","SeriesCode":"SP.POP.TOTL","DESCRIPTION":"Data sources : Eurostat"},{"CountryCode":"BEL","SeriesCode":"SP.POP.GROW","DESCRIPTION":"Data sources : Eurostat"},{"CountryCode":"BEN","SeriesCode":"SP.POP.GROW","DESCRIPTION":"Data sources: United Nations World Population Prospects"},{"CountryCode":"BEN","SeriesCode":"SP.POP.TOTL","DESCRIPTION":"Data sources : United Nations World Population Prospects"},{"CountryCode":"BFA","SeriesCode":"SP.POP.TOTL","DESCRIPTION":"Data sources : United Nations World Population Prospects"},{"CountryCode":"BFA","SeriesCode":"SP.POP.GROW","DESCRIPTION":"Data sources: United Nations World Population Prospects"}],"EdStatsData":[{"Country Name":"Arab World","Country Code":"ARB","Indicator Name":"Adjusted net enrolment rate, primary, both sexes (%)","Indicator Code":"SE.PRM.TENR","2000":"77.2456817626953","2005":"82.4894866943359","2008":"84.0118713378906","2009":"84.1959609985352","2010":"85.2119979858398","2011":"85.2451400756836","2012":"86.1016693115234","2013":"85.5119400024414","2014":"85.3201522827148","2015":""},{"Country Name":"East Asia & Pacific","Country Code":"EAS","Indicator Name":"Adjusted net enrolment rate, primary, both sexes (%)","Indicator Code":"SE.PRM.TENR","2000":"94.9568099975586","2005":"95.181770324707","2008":"95.7309417724609","2009":"96.0687484741211","2010":"96.1660690307617","2011":"96.3647613525391","2012":"96.3226089477539","2013":"96.0940628051758","2014":"96.2079620361328","2015":""},{"Country Name":"East Asia & Pacific (excluding high income)","Country Code":"EAP","Indicator Name":"Adjusted net enrolment rate, primary, both sexes (%)","Indicator Code":"SE.PRM.TENR","2000":"94.6755065917969","2005":"94.8850326538086","2008":"95.4391326904297","2009":"95.8122406005859","2010":"95.9232025146484","2011":"96.1331481933594","2012":"96.0971069335938","2013":"95.9019012451172","2014":"96.0258026123047","2015":""},{"Country Name":"Euro area","Country Code":"EMU","Indicator Name":"Adjusted net enrolment rate, primary, both sexes (%)","Indicator Code":"SE.PRM.TENR","2000":"99.3522720336914","2005":"98.7482986450195","2008":"99.0866928100586","2009":"99.0738983154297","2010":"99.1178588867188","2011":"98.9867401123047","2012":"99.0712280273438","2013":"99.104248046875","2014":"98.9193115234375","2015":""},{"Country Name":"Europe & Central Asia","Country Code":"ECS","Indicator Name":"Adjusted net enrolment rate, primary, both sexes (%)","Indicator Code":"SE.PRM.TENR","2000":"96.6480865478516","2005":"96.7368316650391","2008":"97.1301116943359","2009":"96.9808883666992","2010":"97.2747192382813","2011":"97.3291778564453","2012":"97.2496490478516","2013":"97.3062515258789","2014":"97.022087097168","2015":""},{"Country Name":"Europe & Central Asia (excluding high income)","Country Code":"ECA","Indicator Name":"Adjusted net enrolment rate, primary, both sexes (%)","Indicator Code":"SE.PRM.TENR","2000":"93.925666809082","2005":"94.8106231689453","2008":"95.146240234375","2009":"94.7815170288086","2010":"95.1925735473633","2011":"95.3641891479492","2012":"95.0888366699219","2013":"95.1033325195313","2014":"94.6392593383789","2015":""},{"Country Name":"European Union","Country Code":"EUU","Indicator Name":"Adjusted net enrolment rate, primary, both sexes (%)","Indicator Code":"SE.PRM.TENR","2000":"98.6010589599609","2005":"98.2317810058594","2008":"98.5345687866211","2009":"98.5405731201172","2010":"98.7255935668945","2011":"98.6496810913086","2012":"98.6754989624023","2013":"98.6328125","2014":"98.5083312988281","2015":""},{"Country Name":"Heavily indebted poor countries (HIPC)","Country Code":"HPC","Indicator Name":"Adjusted net enrolment rate, primary, both sexes (%)","Indicator Code":"SE.PRM.TENR","2000":"54.0877990722656","2005":"68.3468170166016","2008":"75.937141418457","2009":"76.0889663696289","2010":"76.0655136108398","2011":"77.5114669799805","2012":"78.7073364257813","2013":"79.9000015258789","2014":"80.689567565918","2015":""},{"Country Name":"High income","Country Code":"HIC","Indicator Name":"Adjusted net enrolment rate, primary, both sexes (%)","Indicator Code":"SE.PRM.TENR","2000":"97.1162567138672","2005":"96.3792266845703","2008":"97.4571228027344","2009":"97.0353698730469","2010":"96.9592208862305","2011":"96.6409378051758","2012":"96.8689727783203","2013":"96.8007736206055","2014":"96.817527770996","2015":"97.1638717651367"},{"Country Name":"Latin America & Caribbean","Country Code":"LCN","Indicator Name":"Adjusted net enrolment rate, primary, both sexes (%)","Indicator Code":"SE.PRM.TENR","2000":"95.6602478027344","2005":"95.1587600708008","2008":"95.3872909545898","2009":"95.4632415771484","2010":"95.6300201416016","2011":"95.5751724243164","2012":"94.8488388061523","2013":"94.3018798828125","2014":"93.9753265380859","2015":""},{"Country Name":"Latin America & Caribbean (excluding high income)","Country Code":"LAC","Indicator Name":"Adjusted net enrolment rate, primary, both sexes (%)","Indicator Code":"SE.PRM.TENR","2000":"95.6891403198242","2005":"95.1215591430664","2008":"95.3614501953125","2009":"95.5054321289063","2010":"95.6606674194336","2011":"95.6587219238281","2012":"94.9143829345703","2013":"94.3569183349609","2014":"94.0029983520508","2015":""},{"Country Name":"Least developed countries: UN classification","Country Code":"LDC","Indicator Name":"Adjusted net enrolment rate, primary, both sexes (%)","Indicator Code":"SE.PRM.TENR","2000":"60.22412109375","2005":"73.4141082763672","2008":"78.8505096435547","2009":"79.196891784668","2010":"79.0647811889648","2011":"80.5829010009766","2012":"81.4536209106445","2013":"82.2595520019531","2014":"82.5270690917969","2015":""},{"Country Name":"Low & middle income","Country Code":"LMY","Indicator Name":"Adjusted net enrolment rate, primary, both sexes (%)","Indicator Code":"SE.PRM.TENR","2000":"83.3934326171875","2005":"87.7802429199219","2008":"89.680061340332","2009":"89.5680389404297","2010":"89.7946701049805","2011":"89.9546279907227","2012":"90.2888336181641","2013":"90.3597793579102","2014":"90.4409637451172","2015":""},{"Country Name":"Low income","Country Code":"LIC","Indicator Name":"Adjusted net enrolment rate, primary, both sexes (%)","Indicator Code":"SE.PRM.TENR","2000":"54.3902816772461","2005":"69.3465576171875","2008":"77.2439117431641","2009":"77.7818908691406","2010":"77.5309982299805","2011":"78.7845993041992","2012":"79.8950500488281","2013":"80.6974868774414","2014":"81.075569152832","2015":"80.9454727172852"},{"Country Name":"Lower middle income","Country Code":"LMC","Indicator Name":"Adjusted net enrolment rate, primary, both sexes (%)","Indicator Code":"SE.PRM.TENR","2000":"81.2648010253906","2005":"87.0896072387695","2008":"89.4365310668945","2009":"89.3196487426758","2010":"90.0078735351563","2011":"90.1707763671875","2012":"90.6671676635742","2013":"90.4885482788085","2014":"90.5145797729492","2015":"90.2624969482422"},{"Country Name":"Middle East & North Africa","Country Code":"MEA","Indicator Name":"Adjusted net enrolment rate, primary, both sexes (%)","Indicator Code":"SE.PRM.TENR","2000":"84.5818634033203","2005":"91.694450378418","2008":"93.3037872314453","2009":"93.8103179931641","2010":"95.0561294555664","2011":"95.3808898925781","2012":"95.7441787719727","2013":"94.9381866455078","2014":"94.5927810668945","2015":""},{"Country Name":"Middle East & North Africa (excluding high income)","Country Code":"MNA","Indicator Name":"Adjusted net enrolment rate, primary, both sexes (%)","Indicator Code":"SE.PRM.TENR","2000":"85.2658081054688","2005":"92.6737899780273","2008":"94.1545791625977","2009":"94.5505523681641","2010":"95.4378280639648","2011":"95.7616195678711","2012":"95.9190216064453","2013":"94.7312774658203","2014":"94.3022994995117","2015":""},{"Country Name":"Middle income","Country Code":"MIC","Indicator Name":"Adjusted net enrolment rate, primary, both sexes (%)","Indicator Code":"SE.PRM.TENR","2000":"87.2571334838867","2005":"90.7570495605469","2008":"91.9626770019531","2009":"91.8291168212891","2010":"92.222801208496","2011":"92.3138580322266","2012":"92.55126953125","2013":"92.4045562744141","2014":"92.4859237670898","2015":"92.3483123779297"},{"Country Name":"North America","Country Code":"NAC","Indicator Name":"Adjusted net enrolment rate, primary, both sexes (%)","Indicator Code":"SE.PRM.TENR","2000":"97.8275909423828","2005":"95.4057693481445","2008":"97.4980163574219","2009":"96.2578735351563","2010":"95.0980224609375","2011":"94.2823791503906","2012":"94.5479431152344","2013":"93.3228378295898","2014":"94.4784393310547","2015":""},{"Country Name":"OECD members","Country Code":"OED","Indicator Name":"Adjusted net enrolment rate, primary, both sexes (%)","Indicator Code":"SE.PRM.TENR","2000":"98.3331909179688","2005":"97.2041625976563","2008":"97.7265930175781","2009":"97.2295989990234","2010":"97.1194229125977","2011":"96.8939437866211","2012":"96.9548873901367","2013":"96.4692764282227","2014":"96.8109512329102","2015":""},{"Country Name":"South Asia","Country Code":"SAS","Indicator Name":"Adjusted net enrolment rate, primary, both sexes (%)","Indicator Code":"SE.PRM.TENR","2000":"79.415641784668","2005":"89.147819519043","2008":"92.4088821411133","2009":"91.7397079467773","2010":"92.4785690307617","2011":"92.0738983154297","2012":"92.9888763427734","2013":"93.3346862792969","2014":"93.5379333496094","2015":""},{"Country Name":"Sub-Saharan Africa","Country Code":"SSF","Indicator Name":"Adjusted net enrolment rate, primary, both sexes (%)","Indicator Code":"SE.PRM.TENR","2000":"60.2315101623535","2005":"69.7988662719727","2008":"75.1319580078125","2009":"75.506233215332","2010":"75.4619979858398","2011":"76.6520919799805","2012":"77.5187835693359","2013":"78.2737121582031","2014":"78.7673110961914","2015":""},{"Country Name":"Arab World","Country Code":"ARB","Indicator Name":"Gross enrolment ratio, secondary, both sexes (%)","Indicator Code":"SE.SEC.ENRR","2000":"59.7451782226563","2005":"65.9310073852539","2008":"65.3422927856445","2009":"66.8289031982422","2010":"68.0508804321289","2011":"70.6914901733398","2012":"71.7165603637695","2013":"70.2746887207031","2014":"70.7350463867188","2015":""},{"Country Name":"East Asia & Pacific","Country Code":"EAS","Indicator Name":"Gross enrolment ratio, secondary, both sexes (%)","Indicator Code":"SE.SEC.ENRR","2000":"62.9672889709473","2005":"67.2239685058594","2008":"75.5086135864258","2009":"78.6416625976563","2010":"81.5026321411133","2011":"84.3281326293945","2012":"86.3395614624023","2013":"88.8673477172852","2014":"87.9348220825195","2015":""},{"Country Name":"East Asia & Pacific (excluding high income)","Country Code":"EAP","Indicator Name":"Gross enrolment ratio, secondary, both sexes (%)","Indicator Code":"SE.SEC.ENRR","2000":"59.6681098937988","2005":"64.8216018676758","2008":"73.5347595214844","2009":"76.7915802001953","2010":"79.8195877075195","2011":"82.78955078125","2012":"84.8219680786133","2013":"87.4938125610352","2014":"86.4609832763672","2015":""},{"Country Name":"Euro area","Country Code":"EMU","Indicator Name":"Gross enrolment ratio, secondary, both sexes (%)","Indicator Code":"SE.SEC.ENRR","2000":"103.126319885254","2005":"105.78182220459","2008":"106.53540802002","2009":"106.625709533691","2010":"107.923141479492","2011":"108.545509338379","2012":"108.740226745605","2013":"111.488388061523","2014":"111.419662475586","2015":""},{"Country Name":"Europe & Central Asia","Country Code":"ECS","Indicator Name":"Gross enrolment ratio, secondary, both sexes (%)","Indicator Code":"SE.SEC.ENRR","2000":"94.5656814575195","2005":"95.2415008544922","2008":"96.5070266723633","2009":"96.0488967895508","2010":"97.8580627441406","2011":"98.5292663574219","2012":"98.9272918701172","2013":"105.351951599121","2014":"105.963516235352","2015":""},{"Country Name":"Europe & Central Asia (excluding high income)","Country Code":"ECA","Indicator Name":"Gross enrolment ratio, secondary, both sexes (%)","Indicator Code":"SE.SEC.ENRR","2000":"87.439323425293","2005":"86.8984680175781","2008":"89.3261032104492","2009":"88.2203063964844","2010":"90.3195419311523","2011":"92.2806625366211","2012":"92.9356231689453","2013":"97.6857223510742","2014":"98.3922882080078","2015":""},{"Country Name":"European Union","Country Code":"EUU","Indicator Name":"Gross enrolment ratio, secondary, both sexes (%)","Indicator Code":"SE.SEC.ENRR","2000":"101.109336853027","2005":"103.135749816895","2008":"103.287353515625","2009":"103.677658081055","2010":"105.08390045166","2011":"104.413101196289","2012":"104.458160400391","2013":"112.446792602539","2014":"112.793739318848","2015":""},{"Country Name":"Heavily indebted poor countries (HIPC)","Country Code":"HPC","Indicator Name":"Gross enrolment ratio, secondary, both sexes (%)","Indicator Code":"SE.SEC.ENRR","2000":"21.9567794799805","2005":"27.7786903381348","2008":"33.4192008972168","2009":"35.222110748291","2010":"36.7456817626953","2011":"37.7686805725098","2012":"38.6723594665527","2013":"39.1621704101563","2014":"39.8661804199219","2015":""},{"Country Name":"High income","Country Code":"HIC","Indicator Name":"Gross enrolment ratio, secondary, both sexes (%)","Indicator Code":"SE.SEC.ENRR","2000":"99.3322296142578","2005":"100.762702941895","2008":"100.549156188965","2009":"100.63005065918","2010":"100.937942504883","2011":"100.878776550293","2012":"101.438842773438","2013":"105.637138366699","2014":"106.348480224609","2015":"106.634559631348"},{"Country Name":"Latin America & Caribbean","Country Code":"LCN","Indicator Name":"Gross enrolment ratio, secondary, both sexes (%)","Indicator Code":"SE.SEC.ENRR","2000":"85.3131637573242","2005":"86.8664703369141","2008":"87.7789535522461","2009":"88.5381774902344","2010":"89.833251953125","2011":"89.280647277832","2012":"89.6584777832031","2013":"93.5160980224609","2014":"94.0967483520508","2015":""},{"Country Name":"Latin America & Caribbean (excluding high income)","Country Code":"LAC","Indicator Name":"Gross enrolment ratio, secondary, both sexes (%)","Indicator Code":"SE.SEC.ENRR","2000":"85.2047882080078","2005":"86.52197265625","2008":"87.5530319213867","2009":"88.402702331543","2010":"89.7498016357422","2011":"89.2155914306641","2012":"89.6500473022461","2013":"93.4190826416016","2014":"94.0217208862305","2015":""},{"Country Name":"Least developed countries: UN classification","Country Code":"LDC","Indicator Name":"Gross enrolment ratio, secondary, both sexes (%)","Indicator Code":"SE.SEC.ENRR","2000":"27.8594398498535","2005":"32.0882987976074","2008":"35.8239517211914","2009":"37.6839981079102","2010":"39.2140197753906","2011":"40.1676902770996","2012":"41.3637084960938","2013":"42.5431785583496","2014":"42.9303512573242","2015":""},{"Country Name":"Low & middle income","Country Code":"LMY","Indicator Name":"Gross enrolment ratio, secondary, both sexes (%)","Indicator Code":"SE.SEC.ENRR","2000":"54.7462196350098","2005":"59.1263809204102","2008":"63.8784408569336","2009":"64.9372787475586","2010":"67.0498199462891","2011":"68.8129272460938","2012":"70.1740417480469","2013":"71.3023681640625","2014":"71.0858688354492","2015":""},{"Country Name":"Low income","Country Code":"LIC","Indicator Name":"Gross enrolment ratio, secondary, both sexes (%)","Indicator Code":"SE.SEC.ENRR","2000":"22.596019744873","2005":"28.5438003540039","2008":"33.7037887573242","2009":"35.0434608459473","2010":"36.7265701293945","2011":"38.0223197937012","2012":"39.0049591064453","2013":"39.1112899780273","2014":"39.255931854248","2015":"39.3088493347167"},{"Country Name":"Lower middle income","Country Code":"LMC","Indicator Name":"Gross enrolment ratio, secondary, both sexes (%)","Indicator Code":"SE.SEC.ENRR","2000":"46.8436584472656","2005":"53.0847511291504","2008":"57.6102714538574","2009":"58.1545906066895","2010":"60.5613594055176","2011":"62.764778137207","2012":"64.8192520141602","2013":"65.7060317993164","2014":"67.8562088012695","2015":"68.3248291015625"},{"Country Name":"Middle East & North Africa","Country Code":"MEA","Indicator Name":"Gross enrolment ratio, secondary, both sexes (%)","Indicator Code":"SE.SEC.ENRR","2000":"68.4755935668945","2005":"72.5532836914063","2008":"73.2738723754883","2009":"74.7019424438477","2010":"75.7031326293945","2011":"79.2240524291992","2012":"80.3443374633789","2013":"78.4495620727539","2014":"79.4149322509766","2015":""},{"Country Name":"Middle East & North Africa (excluding high income)","Country Code":"MNA","Indicator Name":"Gross enrolment ratio, secondary, both sexes (%)","Indicator Code":"SE.SEC.ENRR","2000":"67.1780700683594","2005":"70.7323684692383","2008":"70.9321670532227","2009":"72.5374526977539","2010":"73.3513717651367","2011":"76.9768524169922","2012":"78.0715713500977","2013":"75.5985565185547","2014":"76.3391799926758","2015":""},{"Country Name":"Middle income","Country Code":"MIC","Indicator Name":"Gross enrolment ratio, secondary, both sexes (%)","Indicator Code":"SE.SEC.ENRR","2000":"57.7764282226563","2005":"62.2333908081055","2008":"67.2485733032227","2009":"68.395751953125","2010":"70.7366485595703","2011":"72.7770462036133","2012":"74.4469833374023","2013":"76.1731262207031","2014":"77.6374893188477","2015":"77.7596588134766"},{"Country Name":"North America","Country Code":"NAC","Indicator Name":"Gross enrolment ratio, secondary, both sexes (%)","Indicator Code":"SE.SEC.ENRR","2000":"93.9440689086914","2005":"96.1630706787109","2008":"96.5448913574219","2009":"96.0777282714844","2010":"95.039306640625","2011":"95.4498062133789","2012":"96.3360595703125","2013":"97.1710433959961","2014":"98.6580581665039","2015":""},{"Country Name":"OECD members","Country Code":"OED","Indicator Name":"Gross enrolment ratio, secondary, both sexes (%)","Indicator Code":"SE.SEC.ENRR","2000":"94.8239669799805","2005":"97.563606262207","2008":"97.9972991943359","2009":"96.9935836791992","2010":"97.5742874145508","2011":"97.7712936401367","2012":"97.9409790039063","2013":"102.919563293457","2014":"103.943069458008","2015":""},{"Country Name":"South Asia","Country Code":"SAS","Indicator Name":"Gross enrolment ratio, secondary, both sexes (%)","Indicator Code":"SE.SEC.ENRR","2000":"43.0622291564941","2005":"49.9256591796875","2008":"55.955249786377","2009":"55.8892707824707","2010":"58.9243392944336","2011":"61.4980812072754","2012":"64.0870895385742","2013":"64.5729675292969","2014":"64.7934265136719","2015":""},{"Country Name":"Sub-Saharan Africa","Country Code":"SSF","Indicator Name":"Gross enrolment ratio, secondary, both sexes (%)","Indicator Code":"SE.SEC.ENRR","2000":"26.3293399810791","2005":"32.3138084411621","2008":"36.4396781921387","2009":"38.2817993164063","2010":"40.206169128418","2011":"41.0554695129395","2012":"41.7950286865234","2013":"42.1923408508301","2014":"42.7429389953613","2015":""},{"Country Name":"Arab World","Country Code":"ARB","Indicator Name":"Gross enrolment ratio, tertiary, both sexes (%)","Indicator Code":"SE.TER.ENRR","2000":"18.1609001159668","2005":"21.7314796447754","2008":"23.4378700256348","2009":"24.0988006591797","2010":"24.7618007659912","2011":"24.2738704681396","2012":"25.7760105133057","2013":"27.3303394317627","2014":"28.1749591827393","2015":""},{"Country Name":"East Asia & Pacific","Country Code":"EAS","Indicator Name":"Gross enrolment ratio, tertiary, both sexes (%)","Indicator Code":"SE.TER.ENRR","2000":"15.4879703521729","2005":"23.31907081604","2008":"24.9820098876953","2009":"26.3916301727295","2010":"27.7798309326172","2011":"29.030969619751","2012":"31.0924892425537","2013":"33.3079605102539","2014":"39.1477203369141","2015":""},{"Country Name":"East Asia & Pacific (excluding high income)","Country Code":"EAP","Indicator Name":"Gross enrolment ratio, tertiary, both sexes (%)","Indicator Code":"SE.TER.ENRR","2000":"11.4935703277588","2005":"19.9020309448242","2008":"21.8649997711182","2009":"23.3525791168213","2010":"24.7480907440186","2011":"25.9049797058105","2012":"27.9813499450684","2013":"30.2115802764893","2014":"36.4703216552734","2015":""},{"Country Name":"Euro area","Country Code":"EMU","Indicator Name":"Gross enrolment ratio, tertiary, both sexes (%)","Indicator Code":"SE.TER.ENRR","2000":"52.3407211303711","2005":"60.3563613891602","2008":"62.6048583984375","2009":"63.7883987426758","2010":"65.6864700317383","2011":"67.6250228881836","2012":"68.5085601806641","2013":"69.2888031005859","2014":"71.0014877319336","2015":""},{"Country Name":"Europe & Central Asia","Country Code":"ECS","Indicator Name":"Gross enrolment ratio, tertiary, both sexes (%)","Indicator Code":"SE.TER.ENRR","2000":"45.0676498413086","2005":"55.7300415039063","2008":"58.8188781738281","2009":"59.9360084533691","2010":"61.452751159668","2011":"62.5612411499023","2012":"63.3925094604492","2013":"64.475471496582","2014":"65.0807266235352","2015":""},{"Country Name":"Europe & Central Asia (excluding high income)","Country Code":"ECA","Indicator Name":"Gross enrolment ratio, tertiary, both sexes (%)","Indicator Code":"SE.TER.ENRR","2000":"38.7975883483887","2005":"51.3734817504883","2008":"55.6546401977539","2009":"56.7373580932617","2010":"57.9983100891113","2011":"58.8462982177734","2012":"59.8296203613281","2013":"61.9418106079102","2014":"62.0665817260742","2015":""},{"Country Name":"European Union","Country Code":"EUU","Indicator Name":"Gross enrolment ratio, tertiary, both sexes (%)","Indicator Code":"SE.TER.ENRR","2000":"50.0371704101563","2005":"59.6695289611816","2008":"62.6208381652832","2009":"63.9502487182617","2010":"65.4932479858398","2011":"66.5380172729492","2012":"66.7660903930664","2013":"66.6064910888672","2014":"67.7147674560547","2015":""},{"Country Name":"Heavily indebted poor countries (HIPC)","Country Code":"HPC","Indicator Name":"Gross enrolment ratio, tertiary, both sexes (%)","Indicator Code":"SE.TER.ENRR","2000":"3.44338011741638","2005":"4.81531000137329","2008":"5.89616012573242","2009":"6.46842002868652","2010":"7.09329986572266","2011":"7.32662010192871","2012":"7.68825006484985","2013":"7.95844984054565","2014":"8.12129020690918","2015":""},{"Country Name":"High income","Country Code":"HIC","Indicator Name":"Gross enrolment ratio, tertiary, both sexes (%)","Indicator Code":"SE.TER.ENRR","2000":"55.9894599914551","2005":"65.7357864379883","2008":"68.1417922973633","2009":"69.9712905883789","2010":"72.9753036499023","2011":"74.8225173950195","2012":"75.067527770996","2013":"73.7904968261719","2014":"73.6632919311523","2015":"73.7469177246094"},{"Country Name":"Latin America & Caribbean","Country Code":"LCN","Indicator Name":"Gross enrolment ratio, tertiary, both sexes (%)","Indicator Code":"SE.TER.ENRR","2000":"22.6449699401855","2005":"30.7200908660889","2008":"38.4011192321777","2009":"39.526481628418","2010":"40.5111694335938","2011":"42.7743301391602","2012":"43.7497482299805","2013":"44.5082588195801","2014":"44.6640701293945","2015":""},{"Country Name":"Latin America & Caribbean (excluding high income)","Country Code":"LAC","Indicator Name":"Gross enrolment ratio, tertiary, both sexes (%)","Indicator Code":"SE.TER.ENRR","2000":"21.9502105712891","2005":"29.9561500549316","2008":"37.5985488891602","2009":"38.6215400695801","2010":"39.42041015625","2011":"41.6074600219727","2012":"42.5087013244629","2013":"43.202278137207","2014":"43.3020515441895","2015":""},{"Country Name":"Least developed countries: UN classification","Country Code":"LDC","Indicator Name":"Gross enrolment ratio, tertiary, both sexes (%)","Indicator Code":"SE.TER.ENRR","2000":"3.73247003555298","2005":"4.88510990142822","2008":"6.37975978851318","2009":"7.27287006378174","2010":"8.08197021484375","2011":"8.61583042144775","2012":"8.87170028686523","2013":"9.03561973571777","2014":"9.05949020385742","2015":""},{"Country Name":"Low & middle income","Country Code":"LMY","Indicator Name":"Gross enrolment ratio, tertiary, both sexes (%)","Indicator Code":"SE.TER.ENRR","2000":"13.211540222168","2005":"18.2593803405762","2008":"21.2977504730225","2009":"22.3050708770752","2010":"23.5003890991211","2011":"25.1530494689941","2012":"26.3924198150635","2013":"27.166130065918","2014":"29.0408000946045","2015":""},{"Country Name":"Low income","Country Code":"LIC","Indicator Name":"Gross enrolment ratio, tertiary, both sexes (%)","Indicator Code":"SE.TER.ENRR","2000":"3.31662011146545","2005":"4.44898986816406","2008":"5.40198993682861","2009":"5.96665000915527","2010":"6.66322994232178","2011":"7.03949022293091","2012":"7.34160995483398","2013":"7.4446702003479","2014":"7.6034197807312","2015":"7.62687015533447"},{"Country Name":"Lower middle income","Country Code":"LMC","Indicator Name":"Gross enrolment ratio, tertiary, both sexes (%)","Indicator Code":"SE.TER.ENRR","2000":"11.3227396011353","2005":"13.1683197021484","2008":"16.1151599884033","2009":"17.0207405090332","2010":"18.2069301605225","2011":"20.7187099456787","2012":"21.8857002258301","2013":"21.9868507385254","2014":"23.0778102874756","2015":"23.1234607696533"},{"Country Name":"Middle East & North Africa","Country Code":"MEA","Indicator Name":"Gross enrolment ratio, tertiary, both sexes (%)","Indicator Code":"SE.TER.ENRR","2000":"20.4063205718994","2005":"23.9279003143311","2008":"28.2825603485107","2009":"28.8950004577637","2010":"30.8320808410645","2011":"31.6101398468018","2012":"34.1344718933105","2013":"35.7606201171875","2014":"37.916130065918","2015":""},{"Country Name":"Middle East & North Africa (excluding high income)","Country Code":"MNA","Indicator Name":"Gross enrolment ratio, tertiary, both sexes (%)","Indicator Code":"SE.TER.ENRR","2000":"19.9033298492432","2005":"23.2015895843506","2008":"28.07546043396","2009":"28.6706295013428","2010":"30.4246292114258","2011":"30.8540306091309","2012":"33.1024894714355","2013":"34.526798248291","2014":"36.4227485656738","2015":""},{"Country Name":"Middle income","Country Code":"MIC","Indicator Name":"Gross enrolment ratio, tertiary, both sexes (%)","Indicator Code":"SE.TER.ENRR","2000":"14.1118898391724","2005":"19.6145496368408","2008":"22.8671207427979","2009":"23.9424495697021","2010":"25.2253608703613","2011":"27.1003494262695","2012":"28.5180397033691","2013":"29.4790000915527","2014":"32.3609886169434","2015":"33.2736396789551"},{"Country Name":"North America","Country Code":"NAC","Indicator Name":"Gross enrolment ratio, tertiary, both sexes (%)","Indicator Code":"SE.TER.ENRR","2000":"67.2405471801758","2005":"79.8839721679688","2008":"82.5030899047852","2009":"85.7192230224609","2010":"90.8085479736328","2011":"92.7011032104492","2012":"91.3879165649414","2013":"85.94677734375","2014":"84.0323181152344","2015":""},{"Country Name":"OECD members","Country Code":"OED","Indicator Name":"Gross enrolment ratio, tertiary, both sexes (%)","Indicator Code":"SE.TER.ENRR","2000":"50.715518951416","2005":"60.1077308654785","2008":"62.7402114868164","2009":"64.8157119750977","2010":"68.054443359375","2011":"69.8393020629883","2012":"70.6738662719727","2013":"70.0177764892578","2014":"70.0029907226563","2015":""},{"Country Name":"South Asia","Country Code":"SAS","Indicator Name":"Gross enrolment ratio, tertiary, both sexes (%)","Indicator Code":"SE.TER.ENRR","2000":"8.21277046203613","2005":"9.49197959899902","2008":"13.1427803039551","2009":"14.2237901687622","2010":"15.8562602996826","2011":"19.7481708526611","2012":"21.0744705200195","2013":"20.8268203735352","2014":"20.8386402130127","2015":""},{"Country Name":"Sub-Saharan Africa","Country Code":"SSF","Indicator Name":"Gross enrolment ratio, tertiary, both sexes (%)","Indicator Code":"SE.TER.ENRR","2000":"4.40517997741699","2005":"6.06588983535767","2008":"6.93588018417358","2009":"7.39418983459473","2010":"7.85983991622925","2011":"8.05105972290039","2012":"8.30893039703369","2013":"8.53330039978027","2014":"8.59348011016846","2015":""},{"Country Name":"Arab World","Country Code":"ARB","Indicator Name":"Adult literacy rate, population 15+ years, both sexes (%)","Indicator Code":"SE.ADT.LITR.ZS","2000":"66.0060653686523","2005":"77.3645858764648","2008":"77.3645858764648","2009":"77.3645858764648","2010":"77.3645858764648","2011":"77.3645858764648","2012":"77.3645858764648","2013":"77.3645858764648","2014":"77.3645858764648","2015":""},{"Country Name":"East Asia & Pacific","Country Code":"EAS","Indicator Name":"Adult literacy rate, population 15+ years, both sexes (%)","Indicator Code":"SE.ADT.LITR.ZS","2000":"91.6186904907227","2005":"95.1082229614258","2008":"95.1082229614258","2009":"95.1082229614258","2010":"95.1082229614258","2011":"95.1082229614258","2012":"95.1082229614258","2013":"95.1082229614258","2014":"95.1082229614258","2015":""},{"Country Name":"East Asia & Pacific (excluding high income)","Country Code":"EAP","Indicator Name":"Adult literacy rate, population 15+ years, both sexes (%)","Indicator Code":"SE.ADT.LITR.ZS","2000":"90.7730331420898","2005":"94.7516708374023","2008":"94.7516708374023","2009":"94.7516708374023","2010":"94.7516708374023","2011":"94.7516708374023","2012":"94.7516708374023","2013":"94.7516708374023","2014":"94.7516708374023","2015":""},{"Country Name":"Europe & Central Asia","Country Code":"ECS","Indicator Name":"Adult literacy rate, population 15+ years, both sexes (%)","Indicator Code":"SE.ADT.LITR.ZS","2000":"98.1458435058594","2005":"98.9975891113281","2008":"98.9975891113281","2009":"98.9975891113281","2010":"98.9975891113281","2011":"98.9975891113281","2012":"98.9975891113281","2013":"98.9975891113281","2014":"98.9975891113281","2015":""},{"Country Name":"Europe & Central Asia (excluding high income)","Country Code":"ECA","Indicator Name":"Adult literacy rate, population 15+ years, both sexes (%)","Indicator Code":"SE.ADT.LITR.ZS","2000":"97.2184066772461","2005":"98.7996368408203","2008":"98.7996368408203","2009":"98.7996368408203","2010":"98.7996368408203","2011":"98.7996368408203","2012":"98.7996368408203","2013":"98.7996368408203","2014":"98.7996368408203","2015":""},{"Country Name":"Heavily indebted poor countries (HIPC)","Country Code":"HPC","Indicator Name":"Adult literacy rate, population 15+ years, both sexes (%)","Indicator Code":"SE.ADT.LITR.ZS","2000":"52.2210731506348","2005":"57.8371658325195","2008":"57.8371658325195","2009":"57.8371658325195","2010":"57.8371658325195","2011":"57.8371658325195","2012":"57.8371658325195","2013":"57.8371658325195","2014":"57.8371658325195","2015":""},{"Country Name":"Latin America & Caribbean","Country Code":"LCN","Indicator Name":"Adult literacy rate, population 15+ years, both sexes (%)","Indicator Code":"SE.ADT.LITR.ZS","2000":"89.736442565918","2005":"92.6243133544922","2008":"92.6243133544922","2009":"92.6243133544922","2010":"92.6243133544922","2011":"92.6243133544922","2012":"92.6243133544922","2013":"92.6243133544922","2014":"92.6243133544922","2015":""},{"Country Name":"Latin America & Caribbean (excluding high income)","Country Code":"LAC","Indicator Name":"Adult literacy rate, population 15+ years, both sexes (%)","Indicator Code":"SE.ADT.LITR.ZS","2000":"89.4503936767578","2005":"92.4479904174805","2008":"92.4479904174805","2009":"92.4479904174805","2010":"92.4479904174805","2011":"92.4479904174805","2012":"92.4479904174805","2013":"92.4479904174805","2014":"92.4479904174805","2015":""},{"Country Name":"Least developed countries: UN classification","Country Code":"LDC","Indicator Name":"Adult literacy rate, population 15+ years, both sexes (%)","Indicator Code":"SE.ADT.LITR.ZS","2000":"53.4133987426758","2005":"60.5682334899902","2008":"60.5682334899902","2009":"60.5682334899902","2010":"60.5682334899902","2011":"60.5682334899902","2012":"60.5682334899902","2013":"60.5682334899902","2014":"60.5682334899902","2015":""},{"Country Name":"Low & middle income","Country Code":"LMY","Indicator Name":"Adult literacy rate, population 15+ years, both sexes (%)","Indicator Code":"SE.ADT.LITR.ZS","2000":"77.7821350097656","2005":"82.3050842285156","2008":"82.3050842285156","2009":"82.3050842285156","2010":"82.3050842285156","2011":"82.3050842285156","2012":"82.3050842285156","2013":"82.3050842285156","2014":"82.3050842285156","2015":""},{"Country Name":"Low income","Country Code":"LIC","Indicator Name":"Adult literacy rate, population 15+ years, both sexes (%)","Indicator Code":"SE.ADT.LITR.ZS","2000":"52.6949691772461","2005":"56.5740547180176","2008":"56.5740547180176","2009":"56.5740547180176","2010":"56.5740585327148","2011":"56.5740547180176","2012":"56.5740547180176","2013":"56.5740547180176","2014":"56.5740547180176","2015":""},{"Country Name":"Lower middle income","Country Code":"LMC","Indicator Name":"Adult literacy rate, population 15+ years, both sexes (%)","Indicator Code":"SE.ADT.LITR.ZS","2000":"67.3315963745117","2005":"73.9100799560547","2008":"73.9100799560547","2009":"73.9100799560547","2010":"73.9100799560547","2011":"73.9100799560547","2012":"73.9100799560547","2013":"73.9100799560547","2014":"73.9100799560547","2015":""},{"Country Name":"Middle East & North Africa","Country Code":"MEA","Indicator Name":"Adult literacy rate, population 15+ years, both sexes (%)","Indicator Code":"SE.ADT.LITR.ZS","2000":"70.4031524658203","2005":"80.7500152587891","2008":"80.7500152587891","2009":"80.7500152587891","2010":"80.7500152587891","2011":"80.7500152587891","2012":"80.7500152587891","2013":"80.7500152587891","2014":"80.7500152587891","2015":""},{"Country Name":"Middle East & North Africa (excluding high income)","Country Code":"MNA","Indicator Name":"Adult literacy rate, population 15+ years, both sexes (%)","Indicator Code":"SE.ADT.LITR.ZS","2000":"68.0235748291016","2005":"78.4388122558594","2008":"78.4388122558594","2009":"78.4388122558594","2010":"78.4388122558594","2011":"78.4388122558594","2012":"78.4388122558594","2013":"78.4388122558594","2014":"78.4388122558594","2015":""},{"Country Name":"Middle income","Country Code":"MIC","Indicator Name":"Adult literacy rate, population 15+ years, both sexes (%)","Indicator Code":"SE.ADT.LITR.ZS","2000":"79.7007369995117","2005":"84.3886795043945","2008":"84.3886795043945","2009":"84.3886795043945","2010":"84.3886795043945","2011":"84.3886795043945","2012":"84.3886795043945","2013":"84.3886795043945","2014":"84.3886795043945","2015":""},{"Country Name":"South Asia","Country Code":"SAS","Indicator Name":"Adult literacy rate, population 15+ years, both sexes (%)","Indicator Code":"SE.ADT.LITR.ZS","2000":"58.0854187011719","2005":"66.6911773681641","2008":"66.6911773681641","2009":"66.6911773681641","2010":"66.6911773681641","2011":"66.6911773681641","2012":"66.6911773681641","2013":"66.6911773681641","2014":"66.6911773681641","2015":""},{"Country Name":"Sub-Saharan Africa","Country Code":"SSF","Indicator Name":"Adult literacy rate, population 15+ years, both sexes (%)","Indicator Code":"SE.ADT.LITR.ZS","2000":"56.98193359375","2005":"60.8805465698242","2008":"60.8805465698242","2009":"60.8805465698242","2010":"60.8805465698242","2011":"60.8805465698242","2012":"60.8805465698242","2013":"60.8805465698242","2014":"60.8805465698242","2015":""},{"Country Name":"Sub-Saharan Africa (excluding high income)","Country Code":"SSA","Indicator Name":"Adult literacy rate, population 15+ years, both sexes (%)","Indicator Code":"SE.ADT.LITR.ZS","2000":"56.9764060974121","2005":"60.8757553100586","2008":"60.8757553100586","2009":"60.8757553100586","2010":"60.8757553100586","2011":"60.8757553100586","2012":"60.8757553100586","2013":"60.8757553100586","2014":"60.8757553100586","2015":""},{"Country Name":"Upper middle income","Country Code":"UMC","Indicator Name":"Adult literacy rate, population 15+ years, both sexes (%)","Indicator Code":"SE.ADT.LITR.ZS","2000":"90.6573104858398","2005":"94.2689895629883","2008":"94.2689895629883","2009":"94.2689895629883","2010":"94.2689895629883","2011":"94.2689895629883","2012":"94.2689895629883","2013":"94.2689895629883","2014":"94.2689895629883","2015":""},{"Country Name":"World","Country Code":"WLD","Indicator Name":"Adult literacy rate, population 15+ years, both sexes (%)","Indicator Code":"SE.ADT.LITR.ZS","2000":"81.9029083251953","2005":"85.3133850097656","2008":"85.3133850097656","2009":"85.3133850097656","2010":"85.3157577514648","2011":"85.3133850097656","2012":"85.3133850097656","2013":"85.3133850097656","2014":"85.3133850097656","2015":""},{"Country Name":"Afghanistan","Country Code":"AFG","Indicator Name":"Adult literacy rate, population 15+ years, both sexes (%)","Indicator Code":"SE.ADT.LITR.ZS","2000":"","2005":"","2008":"","2009":"","2010":"","2011":"31.74112","2012":"","2013":"","2014":"","2015":""},{"Country Name":"Albania","Country Code":"ALB","Indicator Name":"Adult literacy rate, population 15+ years, both sexes (%)","Indicator Code":"SE.ADT.LITR.ZS","2000":"","2005":"","2008":"95.93864","2009":"","2010":"","2011":"96.8453","2012":"97.24697","2013":"","2014":"","2015":""},{"Country Name":"Arab World","Country Code":"ARB","Indicator Name":"Primary completion rate, both sexes (%)","Indicator Code":"SE.PRM.CMPT.ZS","2000":"75.3761138916016","2005":"82.9074249267578","2008":"85.2788162231445","2009":"83.7218627929688","2010":"85.4214019775391","2011":"85.396598815918","2012":"87.2548141479492","2013":"85.1492767333984","2014":"86.3892288208008","2015":""},{"Country Name":"East Asia & Pacific","Country Code":"EAS","Indicator Name":"Primary completion rate, both sexes (%)","Indicator Code":"SE.PRM.CMPT.ZS","2000":"92.8886337280273","2005":"92.7678070068359","2008":"99.0191802978516","2009":"101.742515563965","2010":"103.685600280762","2011":"102.728721618652","2012":"103.050331115723","2013":"101.624847412109","2014":"98.1606826782227","2015":""},{"Country Name":"East Asia & Pacific (excluding high income)","Country Code":"EAP","Indicator Name":"Primary completion rate, both sexes (%)","Indicator Code":"SE.PRM.CMPT.ZS","2000":"92.3776550292969","2005":"91.9684371948242","2008":"98.765625","2009":"101.80842590332","2010":"103.997283935547","2011":"102.817123413086","2012":"103.001571655273","2013":"101.576484680176","2014":"97.835563659668","2015":""},{"Country Name":"Euro area","Country Code":"EMU","Indicator Name":"Primary completion rate, both sexes (%)","Indicator Code":"SE.PRM.CMPT.ZS","2000":"99.3132095336914","2005":"96.9741592407227","2008":"99.1175003051758","2009":"99.1552505493164","2010":"99.3351211547852","2011":"99.0706558227539","2012":"98.1803207397461","2013":"97.8632431030273","2014":"97.5947952270508","2015":""},{"Country Name":"Europe & Central Asia","Country Code":"ECS","Indicator Name":"Primary completion rate, both sexes (%)","Indicator Code":"SE.PRM.CMPT.ZS","2000":"95.6831512451172","2005":"98.1976928710938","2008":"97.2363128662109","2009":"97.8471221923828","2010":"98.32958984375","2011":"98.8941497802734","2012":"98.3078460693359","2013":"98.8699417114258","2014":"99.1381988525391","2015":""},{"Country Name":"Europe & Central Asia (excluding high income)","Country Code":"ECA","Indicator Name":"Primary completion rate, both sexes (%)","Indicator Code":"SE.PRM.CMPT.ZS","2000":"93.6861724853516","2005":"99.4402236938477","2008":"96.3834915161133","2009":"97.5752868652344","2010":"98.0712356567383","2011":"99.3967056274414","2012":"98.6901245117188","2013":"100.00691986084","2014":"100.882041931152","2015":""},{"Country Name":"European Union","Country Code":"EUU","Indicator Name":"Primary completion rate, both sexes (%)","Indicator Code":"SE.PRM.CMPT.ZS","2000":"97.9534378051758","2005":"97.1628799438477","2008":"97.7727813720703","2009":"97.8422927856445","2010":"98.510124206543","2011":"98.46044921875","2012":"97.7652816772461","2013":"97.5633087158203","2014":"97.2842864990234","2015":""},{"Country Name":"Heavily indebted poor countries (HIPC)","Country Code":"HPC","Indicator Name":"Primary completion rate, both sexes (%)","Indicator Code":"SE.PRM.CMPT.ZS","2000":"42.9447135925293","2005":"53.9561500549316","2008":"62.148998260498","2009":"64.3116989135742","2010":"65.3105239868164","2011":"64.9472503662109","2012":"65.2091674804688","2013":"65.0485916137695","2014":"65.5025787353516","2015":""},{"Country Name":"High income","Country Code":"HIC","Indicator Name":"Primary completion rate, both sexes (%)","Indicator Code":"SE.PRM.CMPT.ZS","2000":"97.1734237670898","2005":"97.6005172729492","2008":"97.9409790039063","2009":"97.6387023925781","2010":"98.0234069824219","2011":"98.0707168579102","2012":"98.5834197998047","2013":"98.1344375610352","2014":"98.0422134399414","2015":"98.7616882324219"},{"Country Name":"Latin America & Caribbean","Country Code":"LCN","Indicator Name":"Primary completion rate, both sexes (%)","Indicator Code":"SE.PRM.CMPT.ZS","2000":"97.5115432739258","2005":"97.1328353881836","2008":"98.8498229980469","2009":"98.9662399291992","2010":"99.0078125","2011":"99.1703643798828","2012":"99.8747711181641","2013":"99.6371612548828","2014":"99.9717178344727","2015":""},{"Country Name":"Latin America & Caribbean (excluding high income)","Country Code":"LAC","Indicator Name":"Primary completion rate, both sexes (%)","Indicator Code":"SE.PRM.CMPT.ZS","2000":"97.7533874511719","2005":"97.2704238891602","2008":"98.9650573730469","2009":"99.0655288696289","2010":"99.1132049560547","2011":"99.2691040039063","2012":"99.9493865966797","2013":"99.7358551025391","2014":"100.093978881836","2015":""},{"Country Name":"Least developed countries: UN classification","Country Code":"LDC","Indicator Name":"Primary completion rate, both sexes (%)","Indicator Code":"SE.PRM.CMPT.ZS","2000":"47.198184967041","2005":"57.0801429748535","2008":"61.6891288757324","2009":"64.3484268188477","2010":"65.467887878418","2011":"66.6464004516602","2012":"66.8811187744141","2013":"66.78759765625","2014":"67.2061309814453","2015":""},{"Country Name":"Low & middle income","Country Code":"LMY","Indicator Name":"Primary completion rate, both sexes (%)","Indicator Code":"SE.PRM.CMPT.ZS","2000":"80.0041427612305","2005":"84.2053451538086","2008":"87.9108734130859","2009":"89.4057235717773","2010":"90.0771713256836","2011":"89.5124664306641","2012":"90.1781997680664","2013":"89.9762573242188","2014":"89.1554718017578","2015":""},{"Country Name":"Low income","Country Code":"LIC","Indicator Name":"Primary completion rate, both sexes (%)","Indicator Code":"SE.PRM.CMPT.ZS","2000":"42.6260414123535","2005":"53.9084091186523","2008":"61.8404197692871","2009":"65.5106887817383","2010":"65.0373382568359","2011":"64.6651229858398","2012":"65.0556869506835","2013":"65.2062072753906","2014":"65.9599914550781","2015":"65.8663177490234"},{"Country Name":"Lower middle income","Country Code":"LMC","Indicator Name":"Primary completion rate, both sexes (%)","Indicator Code":"SE.PRM.CMPT.ZS","2000":"75.5612335205078","2005":"83.6397323608398","2008":"86.763557434082","2009":"88.061149597168","2010":"88.5786972045898","2011":"88.5553970336914","2012":"90.9935302734375","2013":"91.9770889282227","2014":"93.140022277832","2015":"92.1324234008789"},{"Country Name":"Middle East & North Africa","Country Code":"MEA","Indicator Name":"Primary completion rate, both sexes (%)","Indicator Code":"SE.PRM.CMPT.ZS","2000":"81.7030258178711","2005":"90.9617385864258","2008":"91.4865036010742","2009":"90.6503067016602","2010":"92.6269149780273","2011":"92.7435302734375","2012":"94.6754837036133","2013":"92.3957443237305","2014":"93.7348327636719","2015":""},{"Country Name":"Middle East & North Africa (excluding high income)","Country Code":"MNA","Indicator Name":"Primary completion rate, both sexes (%)","Indicator Code":"SE.PRM.CMPT.ZS","2000":"81.4372024536133","2005":"90.8899612426758","2008":"91.0388336181641","2009":"90.0744857788086","2010":"92.327766418457","2011":"92.4111785888672","2012":"94.0239868164063","2013":"91.2576293945313","2014":"91.8205108642578","2015":""},{"Country Name":"Middle income","Country Code":"MIC","Indicator Name":"Primary completion rate, both sexes (%)","Indicator Code":"SE.PRM.CMPT.ZS","2000":"","2005":"86.7510528564453","2008":"91.6014099121094","2009":"93.0634384155273","2010":"93.7566223144531","2011":"93.4273223876953","2012":"94.655662536621","2013":"94.8748016357422","2014":"94.3085403442383","2015":"93.0838775634766"},{"Country Name":"OECD members","Country Code":"OED","Indicator Name":"Primary completion rate, both sexes (%)","Indicator Code":"SE.PRM.CMPT.ZS","2000":"97.3108901977539","2005":"98.2943344116211","2008":"97.7458801269531","2009":"97.150146484375","2010":"97.3986434936523","2011":"97.5684814453125","2012":"98.6264953613281","2013":"98.7731628417969","2014":"98.8698425292969","2015":""},{"Country Name":"South Asia","Country Code":"SAS","Indicator Name":"Primary completion rate, both sexes (%)","Indicator Code":"SE.PRM.CMPT.ZS","2000":"69.6183929443359","2005":"81.2441177368164","2008":"87.083740234375","2009":"88.6617660522461","2010":"88.4628677368164","2011":"88.1172409057617","2012":"89.9314041137695","2013":"91.2481155395508","2014":"91.3305435180664","2015":""},{"Country Name":"Sub-Saharan Africa","Country Code":"SSF","Indicator Name":"Primary completion rate, both sexes (%)","Indicator Code":"SE.PRM.CMPT.ZS","2000":"53.8776588439941","2005":"61.3893241882324","2008":"64.7417526245117","2009":"66.9683609008789","2010":"68.1832580566406","2011":"68.0601348876953","2012":"68.2630386352539","2013":"68.2357635498047","2014":"68.6390991210938","2015":""},{"Country Name":"Sub-Saharan Africa (excluding high income)","Country Code":"SSA","Indicator Name":"Primary completion rate, both sexes (%)","Indicator Code":"SE.PRM.CMPT.ZS","2000":"53.8733940124512","2005":"61.3851661682129","2008":"64.7384262084961","2009":"66.9653701782227","2010":"68.1805191040039","2011":"68.0575103759766","2012":"68.2605285644531","2013":"68.2333526611328","2014":"68.6367721557617","2015":""},{"Country Name":"Afghanistan","Country Code":"AFG","Indicator Name":"Government expenditure on education as % of GDP (%)","Indicator Code":"SE.XPD.TOTL.GD.ZS","2000":"","2005":"","2008":"","2009":"","2010":"3.46148991584778","2011":"3.43914008140564","2012":"2.5275399684906","2013":"3.48140001296997","2014":"3.78028011322021","2015":"3.31753993034363"},{"Country Name":"Albania","Country Code":"ALB","Indicator Name":"Government expenditure on education as % of GDP (%)","Indicator Code":"SE.XPD.TOTL.GD.ZS","2000":"3.28718996047974","2005":"3.23791003227234","2008":"","2009":"","2010":"","2011":"","2012":"","2013":"3.53943991661072","2014":"","2015":""},{"Country Name":"Algeria","Country Code":"DZA","Indicator Name":"Government expenditure on education as % of GDP (%)","Indicator Code":"SE.XPD.TOTL.GD.ZS","2000":"","2005":"","2008":"4.35424995422363","2009":"","2010":"","2011":"","2012":"","2013":"","2014":"","2015":""},{"Country Name":"Andorra","Country Code":"AND","Indicator Name":"Government expenditure on education as % of GDP (%)","Indicator Code":"SE.XPD.TOTL.GD.ZS","2000":"","2005":"1.60025000572205","2008":"2.93457007408142","2009":"3.16387009620667","2010":"3.06579995155334","2011":"3.15889000892639","2012":"","2013":"2.46257996559143","2014":"2.99780988693237","2015":"3.25367999076843"},{"Country Name":"Angola","Country Code":"AGO","Indicator Name":"Government expenditure on education as % of GDP (%)","Indicator Code":"SE.XPD.TOTL.GD.ZS","2000":"2.60753011703491","2005":"2.77712988853455","2008":"","2009":"","2010":"3.47622990608215","2011":"","2012":"","2013":"","2014":"","2015":""},{"Country Name":"Antigua and Barbuda","Country Code":"ATG","Indicator Name":"Government expenditure on education as % of GDP (%)","Indicator Code":"SE.XPD.TOTL.GD.ZS","2000":"","2005":"","2008":"","2009":"2.55447006225586","2010":"","2011":"","2012":"","2013":"","2014":"","2015":""},{"Country Name":"Argentina","Country Code":"ARG","Indicator Name":"Government expenditure on education as % of GDP (%)","Indicator Code":"SE.XPD.TOTL.GD.ZS","2000":"4.58360004425049","2005":"3.84376001358032","2008":"4.84290981292725","2009":"5.52189016342163","2010":"4.99483013153076","2011":"5.26411008834839","2012":"5.32145023345947","2013":"5.41768980026245","2014":"5.32548999786377","2015":""},{"Country Name":"Armenia","Country Code":"ARM","Indicator Name":"Government expenditure on education as % of GDP (%)","Indicator Code":"SE.XPD.TOTL.GD.ZS","2000":"2.77632999420166","2005":"2.71550989151001","2008":"3.17114996910095","2009":"3.8428099155426","2010":"3.24919009208679","2011":"3.14213991165161","2012":"2.77017998695374","2013":"2.64763998985291","2014":"2.24659991264343","2015":"2.81350994110107"},{"Country Name":"Aruba","Country Code":"ABW","Indicator Name":"Government expenditure on education as % of GDP (%)","Indicator Code":"SE.XPD.TOTL.GD.ZS","2000":"4.71468019485474","2005":"4.6807599067688","2008":"4.91558980941772","2009":"5.92467021942139","2010":"6.71249008178711","2011":"6.03687000274658","2012":"6.54905986785889","2013":"6.80806016921997","2014":"6.16293001174927","2015":""},{"Country Name":"Australia","Country Code":"AUS","Indicator Name":"Government expenditure on education as % of GDP (%)","Indicator Code":"SE.XPD.TOTL.GD.ZS","2000":"4.89265012741089","2005":"4.91228008270264","2008":"4.62719011306763","2009":"5.08641004562378","2010":"5.55523014068604","2011":"5.09834003448486","2012":"4.89990997314453","2013":"5.28584003448486","2014":"5.22533988952637","2015":""},{"Country Name":"Austria","Country Code":"AUT","Indicator Name":"Government expenditure on education as % of GDP (%)","Indicator Code":"SE.XPD.TOTL.GD.ZS","2000":"5.60472011566162","2005":"5.27166986465454","2008":"5.29572010040283","2009":"5.77120018005371","2010":"5.71780014038086","2011":"5.61269998550415","2012":"5.50897979736328","2013":"5.56273984909058","2014":"5.49954986572266","2015":""},{"Country Name":"Azerbaijan","Country Code":"AZE","Indicator Name":"Government expenditure on education as % of GDP (%)","Indicator Code":"SE.XPD.TOTL.GD.ZS","2000":"3.85399007797241","2005":"2.97462010383606","2008":"2.44092988967896","2009":"3.22430992126465","2010":"2.78062009811401","2011":"2.43564009666443","2012":"2.09629988670349","2013":"2.4621798992157","2014":"2.63466000556946","2015":""},{"Country Name":"Bahamas, The","Country Code":"BHS","Indicator Name":"Government expenditure on education as % of GDP (%)","Indicator Code":"SE.XPD.TOTL.GD.ZS","2000":"2.84998989105225","2005":"","2008":"","2009":"","2010":"","2011":"","2012":"","2013":"","2014":"","2015":""},{"Country Name":"Bahrain","Country Code":"BHR","Indicator Name":"Government expenditure on education as % of GDP (%)","Indicator Code":"SE.XPD.TOTL.GD.ZS","2000":"","2005":"","2008":"2.49677991867065","2009":"","2010":"","2011":"","2012":"2.64530992507935","2013":"2.47689008712769","2014":"2.46745991706848","2015":"2.66808009147644"},{"Country Name":"Bangladesh","Country Code":"BGD","Indicator Name":"Government expenditure on education as % of GDP (%)","Indicator Code":"SE.XPD.TOTL.GD.ZS","2000":"2.12085008621216","2005":"","2008":"2.05381989479065","2009":"1.93843996524811","2010":"","2011":"2.13146996498108","2012":"2.17510008811951","2013":"1.95726001262665","2014":"","2015":""},{"Country Name":"Barbados","Country Code":"BRB","Indicator Name":"Government expenditure on education as % of GDP (%)","Indicator Code":"SE.XPD.TOTL.GD.ZS","2000":"4.62160015106201","2005":"5.55693006515503","2008":"5.06107997894287","2009":"5.32742023468018","2010":"5.87584018707275","2011":"","2012":"5.62322998046875","2013":"5.47924995422363","2014":"6.57329988479614","2015":""},{"Country Name":"Belarus","Country Code":"BLR","Indicator Name":"Government expenditure on education as % of GDP (%)","Indicator Code":"SE.XPD.TOTL.GD.ZS","2000":"6.19920015335083","2005":"5.86806011199951","2008":"","2009":"4.53130006790161","2010":"5.42583990097046","2011":"4.84639978408813","2012":"5.12449979782104","2013":"5.17682981491089","2014":"4.99043989181519","2015":"4.94764995574951"},{"Country Name":"Belgium","Country Code":"BEL","Indicator Name":"Government expenditure on education as % of GDP (%)","Indicator Code":"SE.XPD.TOTL.GD.ZS","2000":"","2005":"5.77791976928711","2008":"6.29256010055541","2009":"6.4113302230835","2010":"6.40975999832153","2011":"6.38052988052368","2012":"","2013":"6.64542007446289","2014":"6.58514022827148","2015":""},{"Country Name":"Belize","Country Code":"BLZ","Indicator Name":"Government expenditure on education as % of GDP (%)","Indicator Code":"SE.XPD.TOTL.GD.ZS","2000":"5.02842998504639","2005":"","2008":"5.68775987625122","2009":"6.09577989578247","2010":"6.61329984664916","2011":"","2012":"","2013":"6.21728992462158","2014":"6.42583990097046","2015":""},{"Country Name":"Benin","Country Code":"BEN","Indicator Name":"Government expenditure on education as % of GDP (%)","Indicator Code":"SE.XPD.TOTL.GD.ZS","2000":"2.88742995262145","2005":"3.63625001907349","2008":"3.80053997039795","2009":"4.22354984283447","2010":"5.03251981735229","2011":"","2012":"4.87061977386475","2013":"4.55143976211548","2014":"4.32068014144897","2015":"4.35980987548828"},{"Country Name":"Bermuda","Country Code":"BMU","Indicator Name":"Government expenditure on education as % of GDP (%)","Indicator Code":"SE.XPD.TOTL.GD.ZS","2000":"","2005":"1.98877000808716","2008":"","2009":"2.61519002914429","2010":"2.64421010017395","2011":"","2012":"","2013":"","2014":"1.78285002708435","2015":"1.7043000459671"},{"Country Name":"Bhutan","Country Code":"BTN","Indicator Name":"Government expenditure on education as % of GDP (%)","Indicator Code":"SE.XPD.TOTL.GD.ZS","2000":"5.51379013061523","2005":"7.07810020446777","2008":"4.7975001335144","2009":"4.62671995162964","2010":"4.0244698524475","2011":"4.65257978439331","2012":"","2013":"5.58966016769409","2014":"5.92460012435913","2015":"7.36169004440308"},{"Country Name":"Arab World","Country Code":"ARB","Indicator Name":"Net enrolment rate, primary, both sexes (%)","Indicator Code":"SE.PRM.NENR","2000":"76.2625885009766","2005":"80.9440307617188","2008":"82.7949371337891","2009":"82.9940185546875","2010":"84.2503433227539","2011":"84.3541107177734","2012":"85.5505676269531","2013":"84.7150192260742","2014":"84.3688125610352","2015":""},{"Country Name":"East Asia & Pacific","Country Code":"EAS","Indicator Name":"Net enrolment rate, primary, both sexes (%)","Indicator Code":"SE.PRM.NENR","2000":"94.5199584960938","2005":"94.5009765625","2008":"95.1626815795898","2009":"95.4746780395508","2010":"95.578010559082","2011":"95.7589874267578","2012":"95.7074813842773","2013":"95.4589233398438","2014":"95.5713195800781","2015":""},{"Country Name":"East Asia & Pacific (excluding high income)","Country Code":"EAP","Indicator Name":"Net enrolment rate, primary, both sexes (%)","Indicator Code":"SE.PRM.NENR","2000":"94.2145690917969","2005":"94.1620864868164","2008":"94.841178894043","2009":"95.1866989135742","2010":"95.3049163818359","2011":"95.4932022094727","2012":"95.4456634521484","2013":"95.2298278808594","2014":"95.3505706787109","2015":""},{"Country Name":"Euro area","Country Code":"EMU","Indicator Name":"Net enrolment rate, primary, both sexes (%)","Indicator Code":"SE.PRM.NENR","2000":"98.5091018676758","2005":"98.0213775634766","2008":"98.1084671020508","2009":"97.9613189697266","2010":"98.0654602050781","2011":"98.0808715820313","2012":"98.0774993896484","2013":"98.1949615478516","2014":"98.0498199462891","2015":""},{"Country Name":"Europe & Central Asia","Country Code":"ECS","Indicator Name":"Net enrolment rate, primary, both sexes (%)","Indicator Code":"SE.PRM.NENR","2000":"95.5286407470703","2005":"95.4944534301758","2008":"95.7770767211914","2009":"95.5922088623047","2010":"96.0497665405273","2011":"96.1907501220703","2012":"96.0243225097656","2013":"96.173828125","2014":"95.9326171875","2015":""},{"Country Name":"Europe & Central Asia (excluding high income)","Country Code":"ECA","Indicator Name":"Net enrolment rate, primary, both sexes (%)","Indicator Code":"SE.PRM.NENR","2000":"92.5078125","2005":"93.2110595703125","2008":"93.4081268310547","2009":"93.0283813476563","2010":"93.7802429199219","2011":"93.9429473876953","2012":"93.5082321166992","2013":"93.6391525268555","2014":"93.2333984375","2015":""},{"Country Name":"European Union","Country Code":"EUU","Indicator Name":"Net enrolment rate, primary, both sexes (%)","Indicator Code":"SE.PRM.NENR","2000":"97.626579284668","2005":"97.2401809692383","2008":"97.3691711425781","2009":"97.3534774780273","2010":"97.5864410400391","2011":"97.6873016357422","2012":"97.6840286254883","2013":"97.6822814941406","2014":"97.5895004272461","2015":""},{"Country Name":"Heavily indebted poor countries (HIPC)","Country Code":"HPC","Indicator Name":"Net enrolment rate, primary, both sexes (%)","Indicator Code":"SE.PRM.NENR","2000":"53.8344612121582","2005":"67.9188003540039","2008":"75.4952392578125","2009":"75.5598068237305","2010":"75.5205535888672","2011":"76.9187164306641","2012":"77.9508514404297","2013":"79.1722793579102","2014":"79.9119720458984","2015":""},{"Country Name":"High income","Country Code":"HIC","Indicator Name":"Net enrolment rate, primary, both sexes (%)","Indicator Code":"SE.PRM.NENR","2000":"96.4400482177734","2005":"95.4533081054688","2008":"96.5749969482422","2009":"96.1332092285156","2010":"96.0550003051758","2011":"95.8559112548828","2012":"96.0944366455078","2013":"96.0030288696289","2014":"96.0838775634766","2015":"96.5009002685547"},{"Country Name":"Latin America & Caribbean","Country Code":"LCN","Indicator Name":"Net enrolment rate, primary, both sexes (%)","Indicator Code":"SE.PRM.NENR","2000":"94.152946472168","2005":"93.5999603271484","2008":"93.9977188110352","2009":"94.0033264160156","2010":"94.1669235229492","2011":"94.1631774902344","2012":"93.5570220947266","2013":"92.2010726928711","2014":"91.7444686889648","2015":""},{"Country Name":"Latin America & Caribbean (excluding high income)","Country Code":"LAC","Indicator Name":"Net enrolment rate, primary, both sexes (%)","Indicator Code":"SE.PRM.NENR","2000":"94.1347198486328","2005":"93.5167999267578","2008":"93.9333114624023","2009":"94.0048828125","2010":"94.1524810791016","2011":"94.2240600585938","2012":"93.6029815673828","2013":"92.2055282592773","2014":"91.7164077758789","2015":""},{"Country Name":"Least developed countries: UN classification","Country Code":"LDC","Indicator Name":"Net enrolment rate, primary, both sexes (%)","Indicator Code":"SE.PRM.NENR","2000":"59.5472183227539","2005":"72.6523895263672","2008":"78.1344528198242","2009":"78.3863677978516","2010":"78.0674819946289","2011":"79.615592956543","2012":"80.4466934204102","2013":"81.3047637939453","2014":"81.535888671875","2015":""},{"Country Name":"Low & middle income","Country Code":"LMY","Indicator Name":"Net enrolment rate, primary, both sexes (%)","Indicator Code":"SE.PRM.NENR","2000":"81.862663269043","2005":"85.8555068969727","2008":"87.6554870605469","2009":"87.7307434082031","2010":"87.8817672729492","2011":"88.0479278564453","2012":"88.411750793457","2013":"88.4216079711914","2014":"88.4848937988281","2015":""},{"Country Name":"Low income","Country Code":"LIC","Indicator Name":"Net enrolment rate, primary, both sexes (%)","Indicator Code":"SE.PRM.NENR","2000":"54.193359375","2005":"68.9568328857422","2008":"76.766746520996","2009":"77.2502517700195","2010":"76.8854827880859","2011":"78.0337066650391","2012":"79.090950012207","2013":"79.8331832885742","2014":"80.2075576782227","2015":"80.050163269043"},{"Country Name":"Lower middle income","Country Code":"LMC","Indicator Name":"Net enrolment rate, primary, both sexes (%)","Indicator Code":"SE.PRM.NENR","2000":"78.6333694458008","2005":"83.8853302001953","2008":"86.1270370483398","2009":"86.4018096923828","2010":"86.9376525878906","2011":"87.0420303344727","2012":"87.6010284423828","2013":"87.5075607299805","2014":"87.6856307983398","2015":"87.7859268188477"},{"Country Name":"Middle East & North Africa","Country Code":"MEA","Indicator Name":"Net enrolment rate, primary, both sexes (%)","Indicator Code":"SE.PRM.NENR","2000":"83.6532363891602","2005":"90.1432495117188","2008":"92.0316162109375","2009":"92.5457077026367","2010":"94.0363235473633","2011":"94.4415435791016","2012":"95.3013381958008","2013":"94.2356567382813","2014":"93.7451095581055","2015":""},{"Country Name":"Middle East & North Africa (excluding high income)","Country Code":"MNA","Indicator Name":"Net enrolment rate, primary, both sexes (%)","Indicator Code":"SE.PRM.NENR","2000":"84.2960891723633","2005":"91.0009307861328","2008":"92.851936340332","2009":"93.2656707763672","2010":"94.4264221191406","2011":"94.8277893066406","2012":"95.5619430541992","2013":"94.1025924682617","2014":"93.497673034668","2015":""},{"Country Name":"Middle income","Country Code":"MIC","Indicator Name":"Net enrolment rate, primary, both sexes (%)","Indicator Code":"SE.PRM.NENR","2000":"85.5504989624023","2005":"88.5675201416016","2008":"89.6646499633789","2009":"89.7454376220703","2010":"90.0456466674805","2011":"90.1070175170898","2012":"90.3871536254883","2013":"90.2173004150391","2014":"90.3919830322266","2015":"90.4658584594727"},{"Country Name":"North America","Country Code":"NAC","Indicator Name":"Net enrolment rate, primary, both sexes (%)","Indicator Code":"SE.PRM.NENR","2000":"96.992317199707","2005":"93.9618377685547","2008":"96.3842697143555","2009":"95.1444778442383","2010":"94.023323059082","2011":"93.3359527587891","2012":"93.6825866699219","2013":"93.3228378295898","2014":"93.6193313598633","2015":""},{"Country Name":"OECD members","Country Code":"OED","Indicator Name":"Net enrolment rate, primary, both sexes (%)","Indicator Code":"SE.PRM.NENR","2000":"97.4967727661133","2005":"96.2315826416016","2008":"96.861213684082","2009":"96.3204574584961","2010":"96.2186813354492","2011":"96.0852432250977","2012":"96.0806274414063","2013":"95.8868026733398","2014":"95.8678894042969","2015":""},{"Country Name":"South Asia","Country Code":"SAS","Indicator Name":"Net enrolment rate, primary, both sexes (%)","Indicator Code":"SE.PRM.NENR","2000":"75.854621887207","2005":"84.943359375","2008":"87.7369918823242","2009":"87.8422088623047","2010":"88.2495498657227","2011":"87.7660522460938","2012":"88.6370391845703","2013":"88.9477767944336","2014":"89.1615905761719","2015":""},{"Country Name":"Sub-Saharan Africa","Country Code":"SSF","Indicator Name":"Net enrolment rate, primary, both sexes (%)","Indicator Code":"SE.PRM.NENR","2000":"59.5959396362305","2005":"68.9626693725586","2008":"74.2770767211914","2009":"74.5519027709961","2010":"74.4668502807617","2011":"75.7342910766602","2012":"76.592041015625","2013":"77.486572265625","2014":"77.9469528198242","2015":""},{"Country Name":"Arab World","Country Code":"ARB","Indicator Name":"Lower secondary completion rate, both sexes (%)","Indicator Code":"SE.SEC.CMPT.LO.ZS","2000":"56.2603492736816","2005":"62.9701805114746","2008":"62.0595359802246","2009":"63.8874168395996","2010":"64.7011260986328","2011":"66.5721588134766","2012":"70.2940368652344","2013":"67.4286727905273","2014":"66.96484375","2015":""},{"Country Name":"East Asia & Pacific","Country Code":"EAS","Indicator Name":"Lower secondary completion rate, both sexes (%)","Indicator Code":"SE.SEC.CMPT.LO.ZS","2000":"76.3111953735352","2005":"83.3365020751953","2008":"86.4846954345703","2009":"88.3323135375977","2010":"90.3353424072266","2011":"93.9588851928711","2012":"93.790153503418","2013":"94.2378005981445","2014":"91.7825698852539","2015":""},{"Country Name":"East Asia & Pacific (excluding high income)","Country Code":"EAP","Indicator Name":"Lower secondary completion rate, both sexes (%)","Indicator Code":"SE.SEC.CMPT.LO.ZS","2000":"74.8216400146484","2005":"82.4915618896484","2008":"85.5223846435547","2009":"87.4950942993164","2010":"89.6428680419922","2011":"93.556770324707","2012":"93.3496627807617","2013":"93.8127746582031","2014":"91.1525268554688","2015":""},{"Country Name":"Euro area","Country Code":"EMU","Indicator Name":"Lower secondary completion rate, both sexes (%)","Indicator Code":"SE.SEC.CMPT.LO.ZS","2000":"86.258171081543","2005":"88.6608200073242","2008":"89.4048843383789","2009":"87.9986190795898","2010":"87.6500854492188","2011":"87.7617721557617","2012":"87.1738510131836","2013":"86.5278091430664","2014":"86.2151565551758","2015":""},{"Country Name":"Europe & Central Asia","Country Code":"ECS","Indicator Name":"Lower secondary completion rate, both sexes (%)","Indicator Code":"SE.SEC.CMPT.LO.ZS","2000":"82.5204086303711","2005":"89.4391021728516","2008":"89.3837661743164","2009":"88.1455001831055","2010":"91.96240234375","2011":"92.2314682006836","2012":"91.2663803100586","2013":"91.5606079101563","2014":"92.4239349365234","2015":""},{"Country Name":"Europe & Central Asia (excluding high income)","Country Code":"ECA","Indicator Name":"Lower secondary completion rate, both sexes (%)","Indicator Code":"SE.SEC.CMPT.LO.ZS","2000":"77.5751647949219","2005":"88.5642471313477","2008":"87.7476806640625","2009":"86.2851104736328","2010":"93.9772567749023","2011":"94.4345321655273","2012":"92.9069976806641","2013":"93.973274230957","2014":"95.938232421875","2015":""},{"Country Name":"European Union","Country Code":"EUU","Indicator Name":"Lower secondary completion rate, both sexes (%)","Indicator Code":"SE.SEC.CMPT.LO.ZS","2000":"87.5473403930664","2005":"89.7379913330078","2008":"90.6210174560547","2009":"89.6757507324219","2010":"89.3124313354492","2011":"89.9148788452148","2012":"88.6765060424805","2013":"88.2856979370117","2014":"88.3036804199219","2015":""},{"Country Name":"Heavily indebted poor countries (HIPC)","Country Code":"HPC","Indicator Name":"Lower secondary completion rate, both sexes (%)","Indicator Code":"SE.SEC.CMPT.LO.ZS","2000":"21.3053359985352","2005":"26.1134166717529","2008":"31.3994922637939","2009":"32.5053100585938","2010":"33.6350021362305","2011":"34.3212203979492","2012":"35.0920867919922","2013":"35.8583183288574","2014":"37.0085830688477","2015":""},{"Country Name":"High income","Country Code":"HIC","Indicator Name":"Lower secondary completion rate, both sexes (%)","Indicator Code":"SE.SEC.CMPT.LO.ZS","2000":"89.3392333984375","2005":"91.5666809082031","2008":"92.7797012329102","2009":"92.5292205810547","2010":"93.1411972045898","2011":"92.9559173583984","2012":"92.7678833007813","2013":"92.4333190917969","2014":"92.7586975097656","2015":"93.4904403686523"},{"Country Name":"Latin America & Caribbean","Country Code":"LCN","Indicator Name":"Lower secondary completion rate, both sexes (%)","Indicator Code":"SE.SEC.CMPT.LO.ZS","2000":"69.2525100708008","2005":"74.7793273925781","2008":"76.0983505249023","2009":"76.8545303344727","2010":"77.6529159545898","2011":"77.5027923583984","2012":"77.0804977416992","2013":"76.5182495117188","2014":"76.9352569580078","2015":""},{"Country Name":"Latin America & Caribbean (excluding high income)","Country Code":"LAC","Indicator Name":"Lower secondary completion rate, both sexes (%)","Indicator Code":"SE.SEC.CMPT.LO.ZS","2000":"68.6208267211914","2005":"74.2535781860352","2008":"75.5652084350586","2009":"76.3048553466797","2010":"77.1393280029297","2011":"77.0095748901367","2012":"76.6166076660156","2013":"76.1321105957031","2014":"76.4911499023438","2015":""},{"Country Name":"Least developed countries: UN classification","Country Code":"LDC","Indicator Name":"Lower secondary completion rate, both sexes (%)","Indicator Code":"SE.SEC.CMPT.LO.ZS","2000":"27.6481437683105","2005":"31.4546298980713","2008":"35.4656677246094","2009":"36.619457244873","2010":"37.2109985351563","2011":"38.4493865966797","2012":"39.8682556152344","2013":"41.2015190124512","2014":"42.2114410400391","2015":""},{"Country Name":"Low & middle income","Country Code":"LMY","Indicator Name":"Lower secondary completion rate, both sexes (%)","Indicator Code":"SE.SEC.CMPT.LO.ZS","2000":"59.3909492492676","2005":"65.8256683349609","2008":"68.2982406616211","2009":"69.4694290161133","2010":"70.9031600952148","2011":"72.6644668579102","2012":"73.3143081665039","2013":"73.7689895629883","2014":"73.1920013427734","2015":""},{"Country Name":"Low income","Country Code":"LIC","Indicator Name":"Lower secondary completion rate, both sexes (%)","Indicator Code":"SE.SEC.CMPT.LO.ZS","2000":"21.5280799865723","2005":"26.2177600860596","2008":"30.9016494750977","2009":"32.1601600646973","2010":"33.5407295227051","2011":"34.3644599914551","2012":"35.3279190063477","2013":"35.9929618835449","2014":"37.3775596618652","2015":"37.2803497314453"},{"Country Name":"Lower middle income","Country Code":"LMC","Indicator Name":"Lower secondary completion rate, both sexes (%)","Indicator Code":"SE.SEC.CMPT.LO.ZS","2000":"51.3889503479004","2005":"59.4391288757324","2008":"64.4167327880859","2009":"66.046531677246","2010":"68.1315383911133","2011":"69.8706283569335","2012":"70.8734588623047","2013":"72.2739486694335","2014":"75.3635787963867","2015":"76.1596603393555"},{"Country Name":"Middle East & North Africa","Country Code":"MEA","Indicator Name":"Lower secondary completion rate, both sexes (%)","Indicator Code":"SE.SEC.CMPT.LO.ZS","2000":"63.6038055419922","2005":"70.3433380126953","2008":"69.7126007080078","2009":"71.8416442871094","2010":"72.0818023681641","2011":"74.6506576538086","2012":"79.2737884521484","2013":"75.8316345214844","2014":"75.3205032348633","2015":""},{"Country Name":"Middle East & North Africa (excluding high income)","Country Code":"MNA","Indicator Name":"Lower secondary completion rate, both sexes (%)","Indicator Code":"SE.SEC.CMPT.LO.ZS","2000":"62.2859001159668","2005":"68.6460571289063","2008":"67.3817977905273","2009":"69.1997985839844","2010":"68.8237686157227","2011":"71.8666076660156","2012":"77.224479675293","2013":"73.170036315918","2014":"72.4736328125","2015":""},{"Country Name":"Middle income","Country Code":"MIC","Indicator Name":"Lower secondary completion rate, both sexes (%)","Indicator Code":"SE.SEC.CMPT.LO.ZS","2000":"63.0455207824707","2005":"70.2606887817383","2008":"73.0278701782227","2009":"74.4015274047852","2010":"76.0526123046875","2011":"78.0765762329102","2012":"78.8377685546875","2013":"79.4712295532227","2014":"80.0058288574219","2015":"80.5461273193359"},{"Country Name":"OECD members","Country Code":"OED","Indicator Name":"Lower secondary completion rate, both sexes (%)","Indicator Code":"SE.SEC.CMPT.LO.ZS","2000":"86.0058441162109","2005":"90.2693862915039","2008":"91.687255859375","2009":"91.11669921875","2010":"92.0061340332031","2011":"91.3164825439453","2012":"90.9917907714844","2013":"90.7156143188477","2014":"90.8518753051758","2015":""},{"Country Name":"South Asia","Country Code":"SAS","Indicator Name":"Lower secondary completion rate, both sexes (%)","Indicator Code":"SE.SEC.CMPT.LO.ZS","2000":"49.7619552612305","2005":"56.2986602783203","2008":"62.9072570800781","2009":"65.160530090332","2010":"67.0417098999023","2011":"69.4319305419922","2012":"71.9821014404297","2013":"74.5203094482422","2014":"74.8876953125","2015":""},{"Country Name":"Sub-Saharan Africa","Country Code":"SSF","Indicator Name":"Lower secondary completion rate, both sexes (%)","Indicator Code":"SE.SEC.CMPT.LO.ZS","2000":"28.1338214874268","2005":"32.3178215026855","2008":"36.7742576599121","2009":"37.8544387817383","2010":"38.8898162841797","2011":"39.7595138549805","2012":"40.5940971374512","2013":"41.393741607666","2014":"42.2600784301758","2015":""},{"Country Name":"Sub-Saharan Africa (excluding high income)","Country Code":"SSA","Indicator Name":"Lower secondary completion rate, both sexes (%)","Indicator Code":"SE.SEC.CMPT.LO.ZS","2000":"28.1262950897217","2005":"32.3110198974609","2008":"36.7684783935547","2009":"37.8493423461914","2010":"38.8847961425781","2011":"39.7548484802246","2012":"40.5898246765137","2013":"41.3897972106934","2014":"42.2561225891113","2015":""}],"EdStatsFootNote":[{"CountryCode":"ABW","SeriesCode":"SE.PRE.ENRL.FE","Year":"YR2001","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.TER.TCHR.FE","Year":"YR2005","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.PRE.TCHR.FE","Year":"YR2000","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.SEC.ENRL.GC","Year":"YR2004","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.PRE.TCHR","Year":"YR2006","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.PRE.NENR","Year":"YR2000","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.SEC.ENRL.VO.FE","Year":"YR2005","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.SEC.ENRL.GC","Year":"YR2003","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.PRM.TCHR.FE","Year":"YR1999","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.PRE.TCHR.FE.ZS","Year":"YR2008","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.PRE.ENRL","Year":"YR2006","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.PRE.NENR.FE","Year":"YR2000","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.SEC.ENRL.VO.FE.ZS","Year":"YR2002","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.SEC.TCHR.FE","Year":"YR2006","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.SEC.ENRL.VO.FE.ZS","Year":"YR2007","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.SEC.ENRL.VO","Year":"YR1999","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.PRE.TCHR.FE.ZS","Year":"YR2001","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.PRE.ENRL.FE","Year":"YR2002","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.PRE.NENR.MA","Year":"YR1999","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.SEC.TCHR.FE","Year":"YR2003","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.PRE.ENRL","Year":"YR2004","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.PRE.TCHR","Year":"YR2002","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.PRE.NENR","Year":"YR2004","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.PRM.TCHR.FE","Year":"YR2007","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.PRE.TCHR.FE","Year":"YR2003","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.PRE.ENRL","Year":"YR2000","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.SEC.TCHR.FE","Year":"YR2004","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.SEC.ENRL.GC","Year":"YR2002","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.PRM.TCHR.FE","Year":"YR2004","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.SEC.ENRL.VO.FE","Year":"YR2004","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.PRE.NENR.MA","Year":"YR2003","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.PRE.TCHR.FE","Year":"YR2005","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.TER.TCHR.FE","Year":"YR1999","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.PRM.TCHR.FE","Year":"YR2006","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.PRE.ENRL.FE","Year":"YR1999","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.PRE.NENR.FE","Year":"YR1999","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.PRE.TCHR.FE.ZS","Year":"YR2002","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.PRM.TCHR.FE","Year":"YR2005","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.SEC.ENRL.VO.FE","Year":"YR2001","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.PRE.NENR.FE","Year":"YR2001","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.SEC.ENRL.VO.FE","Year":"YR2008","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.PRE.ENRL","Year":"YR2002","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.PRE.ENRL","Year":"YR2005","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.PRE.ENRL.FE","Year":"YR2006","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.PRE.NENR","Year":"YR2001","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.PRE.NENR","Year":"YR2002","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.PRE.TCHR","Year":"YR2004","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.PRE.TCHR","Year":"YR2007","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.PRE.TCHR.FE","Year":"YR2001","DESCRIPTION":"Country estimation."},{"CountryCode":"ABW","SeriesCode":"SE.PRE.TCHR.FE","Year":"YR2008","DESCRIPTION":"Country estimation."}],"EdStatsSeries":[{"Series Code":"BAR.NOED.1519.FE.ZS","Topic":"Attainment","Indicator Name":"Barro-Lee: Percentage of female population age 15-19 with no education","Short definition":"Percentage of female population age 15-19 with no education","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.NOED.1519.ZS","Topic":"Attainment","Indicator Name":"Barro-Lee: Percentage of population age 15-19 with no education","Short definition":"Percentage of population age 15-19 with no education","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.NOED.15UP.FE.ZS","Topic":"Attainment","Indicator Name":"Barro-Lee: Percentage of female population age 15+ with no education","Short definition":"Percentage of female population age 15+ with no education","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.NOED.15UP.ZS","Topic":"Attainment","Indicator Name":"Barro-Lee: Percentage of population age 15+ with no education","Short definition":"Percentage of population age 15+ with no education","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.NOED.2024.FE.ZS","Topic":"Attainment","Indicator Name":"Barro-Lee: Percentage of female population age 20-24 with no education","Short definition":"Percentage of female population age 20-24 with no education","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.NOED.2024.ZS","Topic":"Attainment","Indicator Name":"Barro-Lee: Percentage of population age 20-24 with no education","Short definition":"Percentage of population age 20-24 with no education","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.NOED.2529.FE.ZS","Topic":"Attainment","Indicator Name":"Barro-Lee: Percentage of female population age 25-29 with no education","Short definition":"Percentage of female population age 25-29 with no education","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.NOED.2529.ZS","Topic":"Attainment","Indicator Name":"Barro-Lee: Percentage of population age 25-29 with no education","Short definition":"Percentage of population age 25-29 with no education","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.NOED.25UP.FE.ZS","Topic":"Attainment","Indicator Name":"Barro-Lee: Percentage of female population age 25+ with no education","Short definition":"Percentage of female population age 25+ with no education","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.NOED.25UP.ZS","Topic":"Attainment","Indicator Name":"Barro-Lee: Percentage of population age 25+ with no education","Short definition":"Percentage of population age 25+ with no education","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.NOED.3034.FE.ZS","Topic":"Attainment","Indicator Name":"Barro-Lee: Percentage of female population age 30-34 with no education","Short definition":"Percentage of female population age 30-34 with no education","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.NOED.3034.ZS","Topic":"Attainment","Indicator Name":"Barro-Lee: Percentage of population age 30-34 with no education","Short definition":"Percentage of population age 30-34 with no education","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.NOED.3539.FE.ZS","Topic":"Attainment","Indicator Name":"Barro-Lee: Percentage of female population age 35-39 with no education","Short definition":"Percentage of female population age 35-39 with no education","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.NOED.3539.ZS","Topic":"Attainment","Indicator Name":"Barro-Lee: Percentage of population age 35-39 with no education","Short definition":"Percentage of population age 35-39 with no education","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.NOED.4044.FE.ZS","Topic":"Attainment","Indicator Name":"Barro-Lee: Percentage of female population age 40-44 with no education","Short definition":"Percentage of female population age 40-44 with no education","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.NOED.4044.ZS","Topic":"Attainment","Indicator Name":"Barro-Lee: Percentage of population age 40-44 with no education","Short definition":"Percentage of population age 40-44 with no education","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.NOED.4549.FE.ZS","Topic":"Attainment","Indicator Name":"Barro-Lee: Percentage of female population age 45-49 with no education","Short definition":"Percentage of female population age 45-49 with no education","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.NOED.4549.ZS","Topic":"Attainment","Indicator Name":"Barro-Lee: Percentage of population age 45-49 with no education","Short definition":"Percentage of population age 45-49 with no education","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.NOED.5054.FE.ZS","Topic":"Attainment","Indicator Name":"Barro-Lee: Percentage of female population age 50-54 with no education","Short definition":"Percentage of female population age 50-54 with no education","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.NOED.5054.ZS","Topic":"Attainment","Indicator Name":"Barro-Lee: Percentage of population age 50-54 with no education","Short definition":"Percentage of population age 50-54 with no education","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.NOED.5559.FE.ZS","Topic":"Attainment","Indicator Name":"Barro-Lee: Percentage of female population age 55-59 with no education","Short definition":"Percentage of female population age 55-59 with no education","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.NOED.5559.ZS","Topic":"Attainment","Indicator Name":"Barro-Lee: Percentage of population age 55-59 with no education","Short definition":"Percentage of population age 55-59 with no education","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.NOED.6064.FE.ZS","Topic":"Attainment","Indicator Name":"Barro-Lee: Percentage of female population age 60-64 with no education","Short definition":"Percentage of female population age 60-64 with no education","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.NOED.6064.ZS","Topic":"Attainment","Indicator Name":"Barro-Lee: Percentage of population age 60-64 with no education","Short definition":"Percentage of population age 60-64 with no education","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.NOED.6569.FE.ZS","Topic":"Attainment","Indicator Name":"Barro-Lee: Percentage of female population age 65-69 with no education","Short definition":"Percentage of female population age 65-69 with no education","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.NOED.6569.ZS","Topic":"Attainment","Indicator Name":"Barro-Lee: Percentage of population age 65-69 with no education","Short definition":"Percentage of population age 65-69 with no education","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.NOED.7074.FE.ZS","Topic":"Attainment","Indicator Name":"Barro-Lee: Percentage of female population age 70-74 with no education","Short definition":"Percentage of female population age 70-74 with no education","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.NOED.7074.ZS","Topic":"Attainment","Indicator Name":"Barro-Lee: Percentage of population age 70-74 with no education","Short definition":"Percentage of population age 70-74 with no education","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.NOED.75UP.FE.ZS","Topic":"Attainment","Indicator Name":"Barro-Lee: Percentage of female population age 75+ with no education","Short definition":"Percentage of female population age 75+ with no education","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.NOED.75UP.ZS","Topic":"Attainment","Indicator Name":"Barro-Lee: Percentage of population age 75+ with no education","Short definition":"Percentage of population age 75+ with no education","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.POP.1519","Topic":"Attainment","Indicator Name":"Barro-Lee: Population in thousands, age 15-19, total","Short definition":"Population in thousands, 15-19, total is the total population of 15-19 year olds in thousands estimated by Barro-Lee.","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.POP.1519.FE","Topic":"Attainment","Indicator Name":"Barro-Lee: Population in thousands, age 15-19, female","Short definition":"Population in thousands, 15-19, female is the female population of 15-19 year olds in thousands estimated by Barro-Lee.","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.POP.15UP","Topic":"Attainment","Indicator Name":"Barro-Lee: Population in thousands, age 15+, total","Short definition":"Population in thousands, 15+, total is the total population over age 15 in thousands estimated by Barro-Lee.","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.POP.15UP.FE","Topic":"Attainment","Indicator Name":"Barro-Lee: Population in thousands, age 15+, female","Short definition":"Population in thousands, 15+, female is the female population over age 15 in thousands estimated by Barro-Lee.","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.POP.2024","Topic":"Attainment","Indicator Name":"Barro-Lee: Population in thousands, age 20-24, total","Short definition":"Population in thousands, 20-24, total is the total population of 20-24 year olds in thousands estimated by Barro-Lee.","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.POP.2024.FE","Topic":"Attainment","Indicator Name":"Barro-Lee: Population in thousands, age 20-24, female","Short definition":"Population in thousands, 20-24, female is the female population of 20-24 year olds in thousands estimated by Barro-Lee.","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.POP.2529","Topic":"Attainment","Indicator Name":"Barro-Lee: Population in thousands, age 25-29, total","Short definition":"Population in thousands, 25-29, total is the total population of 25-29 year olds in thousands estimated by Barro-Lee.","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.POP.2529.FE","Topic":"Attainment","Indicator Name":"Barro-Lee: Population in thousands, age 25-29, female","Short definition":"Population in thousands, 25-29, female is the female population of 25-29 year olds in thousands estimated by Barro-Lee.","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.POP.25UP","Topic":"Attainment","Indicator Name":"Barro-Lee: Population in thousands, age 25+, total","Short definition":"Population in thousands, 25+, total is the total population over age 25 in thousands estimated by Barro-Lee.","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.POP.25UP.FE","Topic":"Attainment","Indicator Name":"Barro-Lee: Population in thousands, age 25+, female","Short definition":"Population in thousands, 25+, female is the female population over age 25 in thousands estimated by Barro-Lee.","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.POP.3034","Topic":"Attainment","Indicator Name":"Barro-Lee: Population in thousands, age 30-34, total","Short definition":"Population in thousands, 30-34, total is the total population of 30-34 year olds in thousands estimated by Barro-Lee.","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.POP.3034.FE","Topic":"Attainment","Indicator Name":"Barro-Lee: Population in thousands, age 30-34, female","Short definition":"Population in thousands, 30-34, female is the female population of 30-34 year olds in thousands estimated by Barro-Lee.","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.POP.3539","Topic":"Attainment","Indicator Name":"Barro-Lee: Population in thousands, age 35-39, total","Short definition":"Population in thousands, 35-39, total is the total population of 35-39 year olds in thousands estimated by Barro-Lee.","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.POP.3539.FE","Topic":"Attainment","Indicator Name":"Barro-Lee: Population in thousands, age 35-39, female","Short definition":"Population in thousands, 35-39, female is the female population of 35-39 year olds in thousands estimated by Barro-Lee.","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.POP.4044","Topic":"Attainment","Indicator Name":"Barro-Lee: Population in thousands, age 40-44, total","Short definition":"Population in thousands, 40-44, total is the total population of 40-44 year olds in thousands estimated by Barro-Lee.","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.POP.4044.FE","Topic":"Attainment","Indicator Name":"Barro-Lee: Population in thousands, age 40-44, female","Short definition":"Population in thousands, 40-44, female is the female population of 40-44 year olds in thousands estimated by Barro-Lee.","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.POP.4549","Topic":"Attainment","Indicator Name":"Barro-Lee: Population in thousands, age 45-49, total","Short definition":"Population in thousands, 45-49, total is the total population of 45-49 year olds in thousands estimated by Barro-Lee.","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.POP.4549.FE","Topic":"Attainment","Indicator Name":"Barro-Lee: Population in thousands, age 45-49, female","Short definition":"Population in thousands, 45-49, female is the female population of 45-49 year olds in thousands estimated by Barro-Lee.","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.POP.5054","Topic":"Attainment","Indicator Name":"Barro-Lee: Population in thousands, age 50-54, total","Short definition":"Population in thousands,50-54, total is the total population of 50-54 year olds in thousands estimated by Barro-Lee.","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.POP.5054.FE","Topic":"Attainment","Indicator Name":"Barro-Lee: Population in thousands, age 50-54, female","Short definition":"Population in thousands,50-54, female is the female population of 50-54 year olds in thousands estimated by Barro-Lee.","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.POP.5559","Topic":"Attainment","Indicator Name":"Barro-Lee: Population in thousands, age 55-59, total","Short definition":"Population in thousands,55-59, total is the total population of 55-59 year olds in thousands estimated by Barro-Lee.","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.POP.5559.FE","Topic":"Attainment","Indicator Name":"Barro-Lee: Population in thousands, age 55-59, female","Short definition":"Population in thousands,55-59, female is the female population of 55-59 year olds in thousands estimated by Barro-Lee.","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.POP.6064","Topic":"Attainment","Indicator Name":"Barro-Lee: Population in thousands, age 60-64, total","Short definition":"Population in thousands,60-64, total is the total population of 60-64 year olds in thousands estimated by Barro-Lee.","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.POP.6064.FE","Topic":"Attainment","Indicator Name":"Barro-Lee: Population in thousands, age 60-64, female","Short definition":"Population in thousands,60-64, female is the female population of 60-64 year olds in thousands estimated by Barro-Lee.","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.POP.6569","Topic":"Attainment","Indicator Name":"Barro-Lee: Population in thousands, age 65-69, total","Short definition":"Population in thousands,65-69, total is the total population of 65-69 year olds in thousands estimated by Barro-Lee.","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.POP.6569.FE","Topic":"Attainment","Indicator Name":"Barro-Lee: Population in thousands, age 65-69, female","Short definition":"Population in thousands,65-69, female is the female population of 65-69 year olds in thousands estimated by Barro-Lee.","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.POP.7074","Topic":"Attainment","Indicator Name":"Barro-Lee: Population in thousands, age 70-74, total","Short definition":"Population in thousands,70-74, total is the total population of 70-74 year olds in thousands estimated by Barro-Lee.","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.POP.7074.FE","Topic":"Attainment","Indicator Name":"Barro-Lee: Population in thousands, age 70-74, female","Short definition":"Population in thousands,70-74, female is the female population of 70-74 year olds in thousands estimated by Barro-Lee.","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.POP.75UP","Topic":"Attainment","Indicator Name":"Barro-Lee: Population in thousands, age 75+, total","Short definition":"Population in thousands,75+, total is the total population over age 75 in thousands estimated by Barro-Lee.","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"},{"Series Code":"BAR.POP.75UP.FE","Topic":"Attainment","Indicator Name":"Barro-Lee: Population in thousands, age 75+, female","Short definition":"Population in thousands,75+, female is the female population over age 75 in thousands estimated by Barro-Lee.","Unit of measure":"","Source":"Robert J. Barro and Jong-Wha Lee: http://www.barrolee.com/"}]};

// ── EMBEDDED_DATASETS ─────────────────────────────────────────────────
// Student 2's stats.js reads from window.EMBEDDED_DATASETS to populate
// the dataset picker modal. We expose each EdStats table as a named entry.
// The EdStatsData table is the richest for visualisation.
const EMBEDDED_DATASETS = {
    'EdStats Data':             RAW_DATA.EdStatsData,
    'EdStats Countries':        RAW_DATA.EdStatsCountry,
    'EdStats Series Metadata':  RAW_DATA.EdStatsSeries,
    'EdStats Country–Series':   RAW_DATA.EdStatsCountry_Series,
    'EdStats Footnotes':        RAW_DATA.EdStatsFootNote,
};

// ── window.DS ─────────────────────────────────────────────────────────
// live working dataset; starts as a copy of EdStatsData (the richest table)
window.DS = [];

// ── TASK A — loadDataset() ────────────────────────────────────────────
// feat: implement loadDataset()
//
// Entry point for Student 1's data pipeline:
//   1. Deep-copies RAW_DATA.EdStatsData into window.DS
//   2. Renders the data table
//   3. Renders the summary cards
//   4. Calls onDataReady() so Student 2's visualisation layer can initialise
//   5. Updates the row-count badge
//
// NOTE: Student 2's stats.js already wires up loadEmbeddedDataset() which
// calls onDataReady() internally.  loadDataset() below is the Student 1
// standalone entry-point (called from index buttons / DOMContentLoaded).

function loadDataset(tableName) {
    // Default to the most analysis-friendly table
    const key = tableName || 'EdStatsData';
    const source = RAW_DATA[key] || RAW_DATA.EdStatsData;

    // 1. Copy into live DS (spread avoids mutating RAW_DATA)
    window.DS = [...source];

    // 2. Populate the table view
    renderTable(window.DS);

    // 3. Summary cards
    renderSummaryCards(window.DS);

    // 4. Notify Student 2's layer if it is present
    if (typeof onDataReady === 'function') {
        // Feed globalData so stats.js charts work seamlessly
        if (typeof globalData !== 'undefined') {
            globalData.length = 0;
            globalData.push(...window.DS);
            if (typeof allColumns !== 'undefined') {
                allColumns = window.DS.length ? Object.keys(window.DS[0]) : [];
            }
        }
        onDataReady();
    }

    // 5. Row-count badge (used in explorer view)
    const rc = document.getElementById('rowCount');
    if (rc) rc.textContent = window.DS.length.toLocaleString() + ' rows';
}

// ── TASK B — renderTable(data) ────────────────────────────────────────
// feat: implement renderTable()
//
// Builds a <tr> per record for every row in `data`.
// Columns rendered: Country Name, Country Code, Indicator Name,
// Indicator Code, and the most recent year columns with data.
//
// CSS classes applied:
//   .row-high   → value ≥ 90  (green tint)
//   .row-mid    → value 50–89 (amber tint)
//   .row-low    → value < 50  (red tint)
//   .row-no-data → all years missing

function renderTable(data) {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;          // guard: element might not exist in this view
    tbody.innerHTML = '';

    if (!data || data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8"
                    class="text-center py-10 text-slate-400 italic text-sm font-medium">
                    No results found.
                </td>
            </tr>`;
        return;
    }

    // Detect the best "recent value" year column (newest non-empty wins)
    const YEAR_COLS = ['2015','2014','2013','2012','2011','2010','2009','2008','2005','2000'];

    data.forEach(row => {
        // Find latest year with a value for this row
        const latestYear = YEAR_COLS.find(y => row[y] !== undefined && row[y] !== '' && row[y] !== null);
        const rawVal     = latestYear ? row[latestYear] : null;
        const numVal     = rawVal !== null ? parseFloat(rawVal) : NaN;

        // Determine CSS tint class based on value magnitude
        let rowClass = 'row-no-data';
        if (!isNaN(numVal)) {
            if (numVal >= 90)      rowClass = 'row-high';
            else if (numVal >= 50) rowClass = 'row-mid';
            else                   rowClass = 'row-low';
        }

        const safeStr = v =>
            (v === null || v === undefined || v === '')
                ? '<span class="text-slate-300 text-[10px] italic">—</span>'
                : _esc(String(v));

        const valDisplay = !isNaN(numVal)
            ? `<span class="font-mono font-black text-blue-700">${numVal.toFixed(2)}</span>
               <span class="text-[9px] text-slate-400 ml-1">(${latestYear})</span>`
            : safeStr(rawVal);

        const tr = document.createElement('tr');
        tr.className = `edstats-row ${rowClass} hover:bg-blue-50/40 transition-colors border-b border-slate-50`;
        tr.innerHTML = `
            <td class="px-4 py-2.5 text-xs text-slate-700 font-medium max-w-[160px] truncate" title="${_esc(row['Country Name'] || '')}">
                ${safeStr(row['Country Name'])}
            </td>
            <td class="px-4 py-2.5 text-xs font-black text-slate-500 uppercase tracking-wider">
                ${safeStr(row['Country Code'])}
            </td>
            <td class="px-4 py-2.5 text-xs text-slate-600 max-w-[220px] truncate" title="${_esc(row['Indicator Name'] || '')}">
                ${safeStr(row['Indicator Name'])}
            </td>
            <td class="px-4 py-2.5 text-[10px] font-mono text-slate-400">
                ${safeStr(row['Indicator Code'])}
            </td>
            <td class="px-4 py-2.5 text-xs text-right">
                ${valDisplay}
            </td>`;
        tbody.appendChild(tr);
    });
}

// tiny HTML-escape helper (avoids collision with stats.js's escapeHtml)
function _esc(str) {
    return String(str)
        .replace(/&/g,'&amp;').replace(/</g,'&lt;')
        .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

// ── TASK C — applyFilterSort() ────────────────────────────────────────
// feat: implement applyFilterSort()
//
// Reads #filterInput (country or indicator name) and #sortSelect, then
// calls renderTable() with the filtered + sorted subset and updates the
// row-count badge.

function applyFilterSort() {
    const filterEl = document.getElementById('filterInput');
    const sortEl   = document.getElementById('sortSelect');

    const query  = filterEl  ? filterEl.value.trim().toLowerCase()  : '';
    const sortBy = sortEl    ? sortEl.value                         : '';

    // ── filter (case-insensitive match on Country Name OR Indicator Name)
    let result = window.DS.filter(row => {
        if (!query) return true;
        const country   = String(row['Country Name']   || '').toLowerCase();
        const indicator = String(row['Indicator Name'] || '').toLowerCase();
        const code      = String(row['Country Code']   || '').toLowerCase();
        return country.includes(query) || indicator.includes(query) || code.includes(query);
    });

    // ── sort
    if (sortBy) {
        const YEAR_COLS = ['2015','2014','2013','2012','2011','2010','2009','2008','2005','2000'];
        const getLatestVal = row => {
            for (const y of YEAR_COLS) {
                const v = parseFloat(row[y]);
                if (!isNaN(v)) return v;
            }
            return null;
        };

        if (sortBy === 'value-desc') {
            result = result.slice().sort((a, b) => {
                const va = getLatestVal(a);
                const vb = getLatestVal(b);
                if (va === null && vb === null) return 0;
                if (va === null) return 1;
                if (vb === null) return -1;
                return vb - va;   // descending
            });
        } else if (sortBy === 'value-asc') {
            result = result.slice().sort((a, b) => {
                const va = getLatestVal(a);
                const vb = getLatestVal(b);
                if (va === null && vb === null) return 0;
                if (va === null) return 1;
                if (vb === null) return -1;
                return va - vb;   // ascending
            });
        } else if (sortBy === 'country-asc') {
            result = result.slice().sort((a, b) =>
                String(a['Country Name'] || '').localeCompare(String(b['Country Name'] || '')));
        } else if (sortBy === 'indicator-asc') {
            result = result.slice().sort((a, b) =>
                String(a['Indicator Name'] || '').localeCompare(String(b['Indicator Name'] || '')));
        }
    }

    renderTable(result);

    // update row-count badge
    const rc = document.getElementById('rowCount');
    if (rc) {
        const suffix = (result.length !== window.DS.length) ? ' (filtered)' : '';
        rc.textContent = result.length.toLocaleString() + ' rows' + suffix;
    }
}

// ── TASK D — resetTable() ─────────────────────────────────────────────
// feat: implement resetTable()
//
// Clears all filter/sort inputs, restores the full dataset, and resets
// the row-count badge.

function resetTable() {
    const filterEl = document.getElementById('filterInput');
    const sortEl   = document.getElementById('sortSelect');
    if (filterEl) filterEl.value = '';
    if (sortEl)   sortEl.value   = '';

    renderTable(window.DS);

    const rc = document.getElementById('rowCount');
    if (rc) rc.textContent = window.DS.length.toLocaleString() + ' rows';
}

// ── TASK E — renderSummaryCards(data) ────────────────────────────────
// feat: implement renderSummaryCards()
//
// Computes four meaningful EdStats metrics and injects them into
// #cardTotalRecords, #cardMeanValue, #cardTopCountry, #cardCoverage.
//
// Cards:
//   1. Total Records       — total rows in the active dataset
//   2. Mean Indicator Value — mean of all non-null recent-year values
//   3. Top Country         — country with the single highest recent value
//   4. Data Coverage       — % of rows that have at least one year value

function renderSummaryCards(data) {
    if (!data || !data.length) return;

    const YEAR_COLS = ['2015','2014','2013','2012','2011','2010','2009','2008','2005','2000'];

    // Helper: get best recent numeric value for a row
    const getLatestVal = row => {
        for (const y of YEAR_COLS) {
            const v = parseFloat(row[y]);
            if (!isNaN(v)) return v;
        }
        return null;
    };

    // ── 1. Total Records
    const totalRecords = data.length;

    // ── 2. Mean of latest values across all rows with data
    const allVals    = data.map(getLatestVal).filter(v => v !== null);
    const meanVal    = allVals.length
        ? (allVals.reduce((s, v) => s + v, 0) / allVals.length)
        : null;

    // ── 3. Top country by highest single latest value
    let topRow   = null;
    let topValue = -Infinity;
    data.forEach(row => {
        const v = getLatestVal(row);
        if (v !== null && v > topValue) { topValue = v; topRow = row; }
    });

    // ── 4. Coverage: % rows with at least one year of data
    const rowsWithData = data.filter(row => getLatestVal(row) !== null).length;
    const coveragePct  = ((rowsWithData / data.length) * 100).toFixed(1);

    // ── Inject into DOM ──────────────────────────────────────────────
    _setCard('cardTotalRecords', {
        label:  'Total Records',
        value:  totalRecords.toLocaleString(),
        sub:    `across ${new Set(data.map(r => r['Country Code'])).size} countries`,
        color:  'text-slate-900',
    });

    _setCard('cardMeanValue', {
        label:  'Mean Indicator Value',
        value:  meanVal !== null ? meanVal.toFixed(2) : '—',
        sub:    `from ${allVals.length.toLocaleString()} non-null observations`,
        color:  'text-blue-600',
    });

    _setCard('cardTopCountry', {
        label:  'Top Country (Latest Value)',
        value:  topRow ? _esc(topRow['Country Name'] || topRow['Country Code']) : '—',
        sub:    topRow
            ? `${_esc(topRow['Indicator Name'] || '').slice(0,42)}… : ${topValue.toFixed(2)}`
            : 'No data',
        color:  'text-emerald-600',
    });

    _setCard('cardCoverage', {
        label:  'Data Coverage',
        value:  coveragePct + '%',
        sub:    `${rowsWithData.toLocaleString()} of ${totalRecords.toLocaleString()} rows have values`,
        color:  parseFloat(coveragePct) >= 80 ? 'text-emerald-600'
                : parseFloat(coveragePct) >= 50 ? 'text-amber-600'
                : 'text-red-600',
    });
}

/**
 * Internal helper: writes content into a summary-card element.
 * Gracefully does nothing if the element doesn't exist (other student's HTML
 * might omit one of these IDs).
 */
function _setCard(id, { label, value, sub, color }) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = `
        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">${label}</span>
        <span class="text-3xl font-black ${color} leading-none mt-1">${value}</span>
        <span class="text-[10px] text-slate-400 font-medium mt-0.5">${sub}</span>`;
}

// =====================================================================
// STATS ENGINE — Student 2 (originally stats.js)
// =====================================================================
// =====================================================================
// STATE & CONSTANTS  (declared first so all functions can reference them)
// =====================================================================
// =====================================================================
// STATE
// =====================================================================
let globalData = [];
let currentParser = null;
let confirmCallback = null;
let currentInfo = null;
let allColumns = [];
let selectedMetricCol = null;
let selectedXCol = null;
let displayedTableData = [];
let currentSortColumn = null;
let sortAscending = true;

const notifModal = document.getElementById('notification-modal');
const proceedBtn = document.getElementById('notif-proceed');

const TABLE_MAX_ROWS = 50;
const MAX_PARSED_ROWS = 15000;
const MAX_SCATTER_POINTS = 800;

const MISSING_VALUE_TOKENS = new Set([
    '', '.', '..', '...', 'null', 'undefined',
    'n/a', 'na', 'nan', 'nil', 'none', '-', '--'
]);

const MSG_NEEDS_NUMERIC   = 'Mathematical analysis requires continuous numerical data.';
const MSG_NEEDS_PAIRS     = 'Correlation and regression require at least two overlapping numeric rows.';
const MSG_NEEDS_VARIATION = 'Variance is zero — all values are identical. Correlation is undefined.';
const MSG_DIST_POSITIVE   = 'Distribution chart requires at least one positive numeric value.';


/** Yield control back to the browser's paint queue. */
function yieldToBrowser(delay = 0) {
    return new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve, delay)));
}

// =====================================================================
// EMBEDDED DATASET LOADER
// =====================================================================
let activeDatasetName = null;

function openDatasetPicker() {
    const modal = document.getElementById('dataset-modal');
    const list  = document.getElementById('dataset-list');
    list.innerHTML = '';

    Object.keys(EMBEDDED_DATASETS).forEach(name => {
        const rows = EMBEDDED_DATASETS[name].length;
        const cols = Object.keys(EMBEDDED_DATASETS[name][0] || {}).length;
        const btn = document.createElement('button');
        btn.className = 'dataset-btn' + (name === activeDatasetName ? ' active' : '');
        btn.innerHTML = `
            <div class="flex items-center justify-between w-full gap-3">
                <div class="flex items-center gap-3">
                    <span class="material-symbols-outlined text-xl text-blue-500">table_view</span>
                    <div class="text-left">
                        <div class="font-black text-sm">${name}</div>
                        <div class="text-[10px] font-medium text-slate-400 mt-0.5">${rows.toLocaleString()} rows · ${cols} columns</div>
                    </div>
                </div>
                ${name === activeDatasetName ? '<span class="material-symbols-outlined text-emerald-500 text-lg">check_circle</span>' : ''}
            </div>`;
        btn.onclick = () => loadEmbeddedDataset(name);
        list.appendChild(btn);
    });

    modal.classList.remove('hidden');
}

async function loadEmbeddedDataset(name) {
    document.getElementById('dataset-modal').classList.add('hidden');

    const data = EMBEDDED_DATASETS[name];
    if (!data || !data.length) return;

    // Reset state
    globalData         = [];
    allColumns         = [];
    currentInfo        = null;
    selectedMetricCol  = null;
    selectedXCol       = null;
    currentSortColumn  = null;
    sortAscending      = true;
    displayedTableData = [];
    activeDatasetName  = name;

    document.getElementById('display-filename').innerText = name;
    document.getElementById('file-badge').classList.remove('hidden');
    document.getElementById('col-selector-panel').classList.add('hidden');
    document.getElementById('col-selector-panel').style.display = 'none';
    document.getElementById('warning-slot').innerHTML = '';
    document.getElementById('scatter-x-row').classList.add('hidden');

    ['barChart', 'doughnutChart', 'scatterPlot'].forEach(id => {
        const ex = Chart.getChart(id); if (ex) ex.destroy();
        document.getElementById(id).classList.add('hidden');
    });
    ['bar-placeholder', 'doughnut-placeholder', 'scatter-placeholder'].forEach(id => {
        document.getElementById(id).classList.remove('hidden');
    });
    ['desc-bar', 'desc-doughnut', 'desc-scatter'].forEach(id => {
        document.getElementById(id).classList.add('opacity-0');
    });
    ['bar-subtitle', 'doughnut-subtitle', 'scatter-subtitle'].forEach(id => {
        document.getElementById(id).innerText = '—';
    });

    document.getElementById('load-progress-bar').style.width  = '0%';
    document.getElementById('load-percentage').innerText       = '0%';
    document.getElementById('desc-stats-content').innerHTML    = 'Waiting for dataset ingestion...';
    document.getElementById('lr-content').innerHTML            = 'Awaiting numerical correlation pairs...';
    document.getElementById('corr-content').innerHTML          = 'Processing feature associations...';
    document.getElementById('insights-content').innerHTML      = 'Waiting for narrative generation...';
    document.getElementById('lr-confidence').innerText         = 'Pending Calculation';

    // Show loading overlay with progress animation
    const overlay = document.getElementById('loading-overlay');
    overlay.classList.remove('hidden');

    // Simulate progress while loading (data is already in memory, just needs processing)
    const CHUNK = 100;
    const total = data.length;
    for (let i = 0; i < total; i += CHUNK) {
        globalData.push(...data.slice(i, i + CHUNK));
        if (!allColumns.length && globalData.length) allColumns = Object.keys(globalData[0]);
        const pct = Math.min(99, Math.round((i / total) * 100));
        document.getElementById('load-progress-bar').style.width = pct + '%';
        document.getElementById('load-percentage').innerText = pct + '%';
        await yieldToBrowser(5);
    }

    document.getElementById('load-progress-bar').style.width = '100%';
    document.getElementById('load-percentage').innerText      = '100%';

    await yieldToBrowser(80);
    overlay.classList.add('hidden');

    if (!allColumns.length && globalData.length) allColumns = Object.keys(globalData[0]);
    await yieldToBrowser(20);
    onDataReady();
}


// =====================================================================
// CORE FUNCTIONS
// =====================================================================
function isMissingValue(value) {
    if (value === null || value === undefined) return true;
    if (typeof value === 'number') return !Number.isFinite(value);
    return MISSING_VALUE_TOKENS.has(String(value).trim().toLowerCase());
}

function toFiniteNumber(value) {
    if (value === null || value === undefined) return null;
    if (typeof value === 'number') return Number.isFinite(value) ? value : null;
    const trimmed = String(value).trim();
    if (!trimmed || MISSING_VALUE_TOKENS.has(trimmed.toLowerCase())) return null;
    const parsed = Number(trimmed.replace(/,/g, ''));
    return Number.isFinite(parsed) ? parsed : null;
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function fmt(value) {
    const n = toFiniteNumber(value);
    if (n === null) return '--';
    if (Math.abs(n) >= 1e12) return (n / 1e12).toFixed(2) + 'T';
    if (Math.abs(n) >= 1e9)  return (n / 1e9).toFixed(2)  + 'B';
    if (Math.abs(n) >= 1e6)  return (n / 1e6).toFixed(2)  + 'M';
    if (Math.abs(n) >= 1e3)  return (n / 1e3).toFixed(2)  + 'K';
    return n.toLocaleString(undefined, { maximumFractionDigits: 4 });
}

function getColumnType(data, columnKey) {
    if (!Array.isArray(data) || !columnKey) return 'categorical';
    let count = 0;
    for (const row of data) {
        if (toFiniteNumber(row?.[columnKey]) !== null) {
            count++;
            if (count >= 2) return 'numeric';
        }
    }
    return 'categorical';
}

function isColumnNumeric(data, columnKey) {
    return getColumnType(data, columnKey) === 'numeric';
}

function getColumnNumericValues(data, columnKey) {
    const values = [];
    for (const row of data) {
        const n = toFiniteNumber(row?.[columnKey]);
        if (n !== null) values.push(n);
    }
    return values;
}

function getNumericPairs(data, xKey, yKey) {
    const pairs = [];
    for (const row of data) {
        const x = toFiniteNumber(row?.[xKey]);
        const y = toFiniteNumber(row?.[yKey]);
        if (x !== null && y !== null) pairs.push({ x, y, row });
    }
    return pairs;
}

function mean(arr) {
    if (!arr.length) return 0;
    return arr.reduce((s, v) => s + v, 0) / arr.length;
}

function variance(arr) {
    const vals = arr.map(toFiniteNumber).filter(v => v !== null);
    if (vals.length < 2) return 0;
    const avg = mean(vals);
    const sumSq = vals.reduce((s, v) => s + (v - avg) ** 2, 0);
    return sumSq / (vals.length - 1);
}

function stdDev(arr) {
    return Math.sqrt(variance(arr));
}

function pearsonCorr(xArr, yArr) {
    const pairs = [];
    for (let i = 0; i < Math.min(xArr.length, yArr.length); i++) {
        const x = toFiniteNumber(xArr[i]);
        const y = toFiniteNumber(yArr[i]);
        if (x !== null && y !== null) pairs.push({ x, y });
    }
    if (pairs.length < 2) return null;
    const xs = pairs.map(p => p.x);
    const ys = pairs.map(p => p.y);
    const mx = mean(xs);
    const my = mean(ys);
    let cov = 0, ssX = 0, ssY = 0;
    for (const p of pairs) {
        const dx = p.x - mx;
        const dy = p.y - my;
        cov += dx * dy;
        ssX += dx * dx;
        ssY += dy * dy;
    }
    const denom = Math.sqrt(ssX * ssY);
    if (denom <= Number.EPSILON) return null;
    const r = cov / denom;
    return Math.max(-1, Math.min(1, r));
}

function linearRegression(xArr, yArr) {
    const pairs = [];
    for (let i = 0; i < Math.min(xArr.length, yArr.length); i++) {
        const x = toFiniteNumber(xArr[i]);
        const y = toFiniteNumber(yArr[i]);
        if (x !== null && y !== null) pairs.push({ x, y });
    }
    if (pairs.length < 2) return null;
    const xs = pairs.map(p => p.x);
    const ys = pairs.map(p => p.y);
    const mx = mean(xs);
    const my = mean(ys);
    let ssX = 0, sXY = 0;
    for (const p of pairs) {
        const dx = p.x - mx;
        ssX += dx * dx;
        sXY += dx * (p.y - my);
    }
    if (ssX <= Number.EPSILON) return null;
    const slope     = sXY / ssX;
    const intercept = my - slope * mx;
    const r         = pearsonCorr(xs, ys);
    const r2        = r === null ? null : Math.max(0, Math.min(1, r * r));
    return { slope, intercept, r2, sampleSize: pairs.length };
}

function detectDatasetFormat(data) {
    if (!data.length) return { format: 'empty', numericCols: [], categoricalCols: [], labelCol: null, yearCols: [], textCols: [] };
    const columns = Object.keys(data[0]);
    const sample  = data.slice(0, Math.min(400, data.length));
    const colStats = columns.map(column => {
        const values       = sample.map(r => r[column]).filter(v => !isMissingValue(v));
        const numericCount = values.filter(v => toFiniteNumber(v) !== null).length;
        const ratio        = values.length ? numericCount / values.length : 0;
        const isYearCol    = /^\d{4}$/.test(String(column).trim());
        return { column, ratio, numericCount, isYearCol, totalVals: values.length };
    });
    const yearCols          = colStats.filter(s => s.isYearCol && s.ratio > 0.03).map(s => s.column);
    const strongNumericCols = colStats.filter(s => !s.isYearCol && s.ratio > 0.5).map(s => s.column);
    const textCols          = colStats.filter(s => s.ratio < 0.15 && s.totalVals > 0).map(s => s.column);

    if (yearCols.length >= 3) {
        const labelCandidates = textCols.filter(col => {
            const unique = new Set(sample.map(r => r[col]).filter(v => !isMissingValue(v)).map(v => String(v).trim())).size;
            return unique > 1;
        });
        const labelCol = labelCandidates.find(c => /country.?name/i.test(c))
            || labelCandidates.find(c => /indicator.?name/i.test(c))
            || labelCandidates[0] || columns[0];
        const allSelectableCols = [...yearCols, ...textCols.filter(c => c !== labelCol)];
        return { format: 'wide', numericCols: yearCols, categoricalCols: textCols, labelCol, yearCols, textCols, allSelectableCols };
    }

    if (strongNumericCols.length >= 1) {
        const labelCandidates = [...textCols].sort((a, b) =>
            new Set(sample.map(r => r[b])).size - new Set(sample.map(r => r[a])).size
        );
        const labelCol        = labelCandidates[0] || columns[0];
        const categoricalCols = textCols.filter(c => c !== labelCol);
        const allSelectableCols = [...strongNumericCols, ...categoricalCols];
        return { format: 'long', numericCols: strongNumericCols, categoricalCols, labelCol, yearCols: [], textCols, allSelectableCols };
    }

    const categoricalCols = textCols;
    return { format: 'text-only', numericCols: [], categoricalCols, labelCol: null, yearCols: [], textCols, allSelectableCols: textCols };
}

function getRowLabel(row, info) {
    if (info.format === 'wide') {
        const countryCol   = Object.keys(row).find(k => /country.?name/i.test(k));
        const indicatorCol = Object.keys(row).find(k => /indicator.?name/i.test(k));
        if (countryCol && indicatorCol) {
            const country   = isMissingValue(row[countryCol])   ? 'N/A' : String(row[countryCol]).trim();
            const indicator = isMissingValue(row[indicatorCol]) ? 'N/A' : String(row[indicatorCol]).trim().slice(0, 28);
            return `${country} - ${indicator}`;
        }
        if (countryCol && !isMissingValue(row[countryCol])) return String(row[countryCol]).trim();
    }
    const val = row[info.labelCol];
    return !isMissingValue(val) ? String(val).trim().slice(0, 40) : 'N/A';
}

function getCategoryFrequencies(data, columnKey) {
    const freq = new Map();
    for (const row of data) {
        const raw = row?.[columnKey];
        if (isMissingValue(raw)) continue;
        const key = String(raw).trim();
        if (!key) continue;
        freq.set(key, (freq.get(key) || 0) + 1);
    }
    return [...freq.entries()].sort((a, b) => b[1] - a[1]).map(([label, count]) => ({ label, count }));
}

function sortByColumn(data, columnKey, ascending = true) {
    if (!Array.isArray(data) || !columnKey) return [];
    const dir = ascending ? 1 : -1;
    return [...data].sort((a, b) => {
        const rawA = a?.[columnKey];
        const rawB = b?.[columnKey];
        const aMissing = isMissingValue(rawA);
        const bMissing = isMissingValue(rawB);
        if (aMissing && bMissing) return 0;
        if (aMissing) return 1;
        if (bMissing) return -1;
        const nA = toFiniteNumber(rawA);
        const nB = toFiniteNumber(rawB);
        if (nA !== null && nB !== null) return (nA - nB) * dir;
        if (nA !== null) return -1 * dir;
        if (nB !== null) return  1 * dir;
        return String(rawA).trim().toLowerCase()
            .localeCompare(String(rawB).trim().toLowerCase(), undefined, { numeric: true }) * dir;
    });
}

function handleTableSort(columnKey, direction) {
    if (!columnKey) return;
    sortAscending      = direction === 'asc';
    currentSortColumn  = columnKey;
    displayedTableData = sortByColumn(globalData, columnKey, sortAscending);
}

function computeColumnProfiles(data, columns) {
    return columns.map(col => {
        const rawVals    = data.map(r => r?.[col]);
        const nonMissing = rawVals.filter(v => !isMissingValue(v));
        const numVals    = nonMissing.map(v => toFiniteNumber(v)).filter(v => v !== null);
        const isNum      = numVals.length >= 2;
        const missing    = rawVals.length - nonMissing.length;
        const missingPct = rawVals.length ? ((missing / rawVals.length) * 100).toFixed(1) : '0.0';
        const unique     = new Set(nonMissing.map(v => String(v).trim())).size;
        let profile = { col, type: isNum ? 'numeric' : 'categorical', count: nonMissing.length, missing, missingPct, unique };
        if (isNum) {
            const sorted = [...numVals].sort((a, b) => a - b);
            const n      = sorted.length;
            const avg    = mean(numVals);
            const sd     = stdDev(numVals);
            const q1     = sorted[Math.floor(n * 0.25)];
            const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)];
            const q3     = sorted[Math.floor(n * 0.75)];
            const cv     = Math.abs(avg) > Number.EPSILON ? (sd / Math.abs(avg)) * 100 : null;
            let skewNum = 0;
            for (const v of numVals) skewNum += ((v - avg) / (sd || 1)) ** 3;
            const skew = n > 2 ? (skewNum / n) : null;
            profile = { ...profile, avg, sd, min: sorted[0], max: sorted[n - 1], q1, median, q3, cv, skew };
        } else {
            const freqMap = new Map();
            for (const v of nonMissing) {
                const k = String(v).trim();
                freqMap.set(k, (freqMap.get(k) || 0) + 1);
            }
            const topCats = [...freqMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
            profile.topCats = topCats;
        }
        return profile;
    });
}

function sparkBar(values) {
    if (!values || values.length < 2) return '<span class="text-slate-300 text-xs">—</span>';
    const mn  = Math.min(...values);
    const mx  = Math.max(...values);
    if (mn === mx) return '<span class="text-xs text-slate-300">uniform</span>';
    const buckets = [0, 0, 0, 0, 0, 0, 0, 0];
    const range   = mx - mn;
    for (const v of values) {
        const idx = Math.min(7, Math.floor(((v - mn) / range) * 8));
        buckets[idx]++;
    }
    const peak = Math.max(...buckets);
    return '<div class="flex items-end gap-[2px] h-5">' +
        buckets.map(b => {
            const h = peak > 0 ? Math.max(2, Math.round((b / peak) * 20)) : 2;
            return `<div style="height:${h}px;width:5px;background:#2563eb;border-radius:1px;opacity:${0.35 + 0.65 * (b / peak)}"></div>`;
        }).join('') + '</div>';
}

function skewBadge(skew) {
    if (skew === null || skew === undefined) return '—';
    const abs = Math.abs(skew);
    if (abs < 0.5)  return `<span class="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">Symmetric (${skew.toFixed(2)})</span>`;
    if (abs < 1.0)  return `<span class="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700">Moderate skew (${skew.toFixed(2)})</span>`;
    return `<span class="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700">High skew (${skew.toFixed(2)})</span>`;
}

function renderCorrelationHeatmap(data, numCols) {
    const cols = numCols.slice(0, 10);
    if (cols.length < 2) return '';
    const colVals = cols.map(c => getColumnNumericValues(data, c));
    const corrs   = cols.map((_, i) => cols.map((__, j) => {
        if (i === j) return 1;
        return pearsonCorr(colVals[i], colVals[j]) ?? 0;
    }));
    const cellSize = Math.max(40, Math.min(72, Math.floor(560 / cols.length)));
    const headerCells = cols.map(c =>
        `<th style="width:${cellSize}px;max-width:${cellSize}px" class="text-[9px] font-black uppercase text-slate-500 pb-2 text-center overflow-hidden">
            <div class="truncate px-1" title="${escapeHtml(c)}">${escapeHtml(c.slice(0, 12))}</div></th>`
    ).join('');
    const rows = cols.map((rowCol, i) => {
        const cells = cols.map((__, j) => {
            const r   = corrs[i][j];
            const abs = Math.abs(r);
            let bg, txtColor;
            if (i === j) { bg = '#1e3a8a'; txtColor = '#fff'; }
            else if (r > 0) { bg = `rgba(37,99,235,${abs * 0.85 + 0.05})`; txtColor = abs > 0.5 ? '#fff' : '#1e3a8a'; }
            else            { bg = `rgba(239,68,68,${abs * 0.85 + 0.05})`; txtColor = abs > 0.5 ? '#fff' : '#991b1b'; }
            return `<td style="width:${cellSize}px;height:${cellSize}px;background:${bg};border:2px solid #f8fafc" class="text-center rounded">
                        <span style="color:${txtColor}" class="text-[10px] font-black">${r.toFixed(2)}</span></td>`;
        }).join('');
        const shortLabel = rowCol.length > 14 ? rowCol.slice(0, 14) + '…' : rowCol;
        return `<tr><td class="text-[9px] font-bold text-slate-500 pr-3 whitespace-nowrap text-right" title="${escapeHtml(rowCol)}">${escapeHtml(shortLabel)}</td>${cells}</tr>`;
    }).join('');
    return `
    <div class="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mt-2">
        <div class="flex items-center justify-between mb-6">
            <div>
                <h3 class="text-lg font-black text-slate-900 tracking-tight">Correlation Heatmap</h3>
                <p class="text-xs text-slate-400 mt-0.5">Pearson r between all numeric columns (up to 10)</p>
            </div>
            <div class="flex items-center gap-3 text-[10px] font-bold text-slate-400">
                <span class="flex items-center gap-1"><span class="w-3 h-3 rounded-sm inline-block" style="background:rgba(37,99,235,0.8)"></span>Positive</span>
                <span class="flex items-center gap-1"><span class="w-3 h-3 rounded-sm inline-block" style="background:rgba(239,68,68,0.8)"></span>Negative</span>
                <span class="flex items-center gap-1"><span class="w-3 h-3 rounded-sm inline-block" style="background:#1e3a8a"></span>Self</span>
            </div>
        </div>
        <div class="overflow-x-auto">
            <table class="border-collapse" style="table-layout:fixed">
                <thead><tr><th style="width:110px"></th>${headerCells}</tr></thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    </div>`;
}

function buildProfileCard(profile, numVals) {
    const typeBadge = profile.type === 'numeric'
        ? `<span class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100">Numeric</span>`
        : `<span class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-amber-50 text-amber-700 border border-amber-100">Categorical</span>`;
    const missingBar = parseFloat(profile.missingPct) > 0
        ? `<div class="mt-2"><div class="flex justify-between text-[9px] font-bold text-slate-400 mb-0.5"><span>Missing</span><span class="text-red-500">${profile.missingPct}%</span></div>
            <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"><div class="h-full bg-red-400 rounded-full" style="width:${Math.min(100, profile.missingPct)}%"></div></div></div>`
        : `<div class="mt-2 text-[9px] font-bold text-emerald-600">✓ No missing values</div>`;
    let body = '';
    if (profile.type === 'numeric') {
        body = `<div class="grid grid-cols-3 gap-2 mt-3">
            <div class="bg-slate-50 rounded-xl p-2 text-center"><p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Min</p><p class="text-sm font-black text-slate-700 mt-0.5">${fmt(profile.min)}</p></div>
            <div class="bg-blue-50 rounded-xl p-2 text-center border border-blue-100"><p class="text-[9px] font-black text-blue-400 uppercase tracking-widest">Mean</p><p class="text-sm font-black text-blue-700 mt-0.5">${fmt(profile.avg)}</p></div>
            <div class="bg-slate-50 rounded-xl p-2 text-center"><p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Max</p><p class="text-sm font-black text-slate-700 mt-0.5">${fmt(profile.max)}</p></div>
        </div>
        <div class="grid grid-cols-3 gap-2 mt-2">
            <div class="bg-slate-50 rounded-xl p-2 text-center"><p class="text-[9px] font-black text-slate-400 uppercase">Q1</p><p class="text-xs font-black text-slate-600 mt-0.5">${fmt(profile.q1)}</p></div>
            <div class="bg-slate-50 rounded-xl p-2 text-center"><p class="text-[9px] font-black text-slate-400 uppercase">Median</p><p class="text-xs font-black text-slate-600 mt-0.5">${fmt(profile.median)}</p></div>
            <div class="bg-slate-50 rounded-xl p-2 text-center"><p class="text-[9px] font-black text-slate-400 uppercase">Q3</p><p class="text-xs font-black text-slate-600 mt-0.5">${fmt(profile.q3)}</p></div>
        </div>
        <div class="grid grid-cols-2 gap-2 mt-2">
            <div class="bg-slate-50 rounded-xl p-2 text-center"><p class="text-[9px] font-black text-slate-400 uppercase">Std Dev</p><p class="text-xs font-black text-slate-600 mt-0.5">${fmt(profile.sd)}</p></div>
            <div class="bg-slate-50 rounded-xl p-2 text-center"><p class="text-[9px] font-black text-slate-400 uppercase">CV %</p><p class="text-xs font-black text-slate-600 mt-0.5">${profile.cv !== null ? profile.cv.toFixed(1) + '%' : '—'}</p></div>
        </div>
        <div class="mt-3 flex items-center justify-between"><span class="text-[9px] font-black text-slate-400 uppercase">Distribution</span>${sparkBar(numVals)}</div>
        <div class="mt-2 flex items-center justify-between"><span class="text-[9px] font-black text-slate-400 uppercase">Skewness</span>${skewBadge(profile.skew)}</div>`;
    } else {
        const catRows = (profile.topCats || []).map(([label, count]) => {
            const pct = profile.count ? ((count / profile.count) * 100).toFixed(1) : '0.0';
            return `<div class="flex items-center justify-between gap-2 mt-1.5">
                <span class="text-xs text-slate-600 truncate max-w-[120px]" title="${escapeHtml(label)}">${escapeHtml(label.slice(0, 18))}${label.length > 18 ? '…' : ''}</span>
                <div class="flex items-center gap-2 flex-shrink-0">
                    <div class="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div class="h-full bg-amber-400 rounded-full" style="width:${pct}%"></div></div>
                    <span class="text-[10px] font-black text-slate-500 w-10 text-right">${pct}%</span>
                </div></div>`;
        }).join('');
        body = `<div class="mt-3"><p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Top Categories</p>${catRows || '<span class="text-slate-300 text-xs">No data</span>'}</div>`;
    }
    return `<div class="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col hover:shadow-md hover:border-blue-100 transition-all duration-200">
        <div class="flex items-start justify-between gap-2 mb-1">
            <h4 class="text-sm font-black text-slate-800 leading-tight break-all" title="${escapeHtml(profile.col)}">${escapeHtml(profile.col.slice(0, 32))}${profile.col.length > 32 ? '…' : ''}</h4>
            ${typeBadge}
        </div>
        <div class="flex items-center gap-4 text-[10px] font-bold text-slate-400 mt-1">
            <span>${profile.count.toLocaleString()} values</span>
            <span>${profile.unique.toLocaleString()} unique</span>
        </div>
        ${missingBar}${body}</div>`;
}

function buildDataTable(data, columns, maxRows) {
    const rows = data.slice(0, maxRows);
    const headerCells = columns.map(col => {
        const isActive = currentSortColumn === col;
        const arrow    = isActive ? (sortAscending ? ' ↑' : ' ↓') : '';
        return `<th class="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-500 whitespace-nowrap cursor-pointer hover:text-blue-600 select-none border-b border-slate-100 transition-colors"
                    onclick="explorerTableSort('${escapeHtml(col).replace(/'/g, "\\'")}')"
                    title="Sort by ${escapeHtml(col)}">
                    ${escapeHtml(col.slice(0, 20))}${col.length > 20 ? '…' : ''}${isActive ? `<span class="text-blue-600">${arrow}</span>` : ''}</th>`;
    }).join('');
    const dataCells = rows.map((row, ri) => {
        const cells = columns.map(col => {
            const raw = row?.[col];
            const num = toFiniteNumber(raw);
            const val = isMissingValue(raw)
                ? `<span class="text-slate-300 italic text-[10px]">—</span>`
                : num !== null
                    ? `<span class="font-mono text-blue-700 font-bold">${fmt(num)}</span>`
                    : `<span class="text-slate-600">${escapeHtml(String(raw).slice(0, 40))}${String(raw).length > 40 ? '…' : ''}</span>`;
            return `<td class="px-4 py-2.5 text-xs border-b border-slate-50 max-w-[200px] truncate">${val}</td>`;
        }).join('');
        const bg = ri % 2 === 0 ? '' : 'bg-slate-50/50';
        return `<tr class="${bg} hover:bg-blue-50/30 transition-colors">${cells}</tr>`;
    }).join('');
    return `<div class="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm">
        <table class="w-full border-collapse min-w-max">
            <thead class="bg-slate-50 sticky top-0 z-10"><tr>${headerCells}</tr></thead>
            <tbody>${dataCells}</tbody>
        </table></div>`;
}

function explorerTableSort(col) {
    if (currentSortColumn === col) { sortAscending = !sortAscending; }
    else { currentSortColumn = col; sortAscending = true; }
    displayedTableData = sortByColumn(globalData, currentSortColumn, sortAscending);
    renderExplorerTable(displayedTableData, TABLE_MAX_ROWS);
}

function explorerSearch(query) {
    const q = query.trim().toLowerCase();
    if (!q) { displayedTableData = globalData; }
    else { displayedTableData = globalData.filter(row => Object.values(row).some(v => !isMissingValue(v) && String(v).toLowerCase().includes(q))); }
    const tableContainer = document.getElementById('explorer-table-container');
    if (tableContainer && allColumns.length) {
        tableContainer.innerHTML = buildDataTable(displayedTableData, allColumns, TABLE_MAX_ROWS);
        const countEl = document.getElementById('explorer-row-count');
        if (countEl) countEl.innerText = `${Math.min(TABLE_MAX_ROWS, displayedTableData.length).toLocaleString()} of ${displayedTableData.length.toLocaleString()} rows${q ? ' (filtered)' : ''}`;
    }
}

function renderExplorerTable(dataToDisplay = globalData, maxRows = TABLE_MAX_ROWS) {
    displayedTableData = Array.isArray(dataToDisplay) ? dataToDisplay : [];
    const container = document.getElementById('view-explorer');
    if (!container) return;
    const columns     = allColumns.length ? allColumns : (globalData.length ? Object.keys(globalData[0]) : []);
    const totalRows   = globalData.length;
    const totalCols   = columns.length;
    const numColsList = columns.filter(c => isColumnNumeric(globalData, c));
    const catColsList = columns.filter(c => !isColumnNumeric(globalData, c));
    const sampleData  = globalData.slice(0, Math.min(3000, globalData.length));
    const profiles    = computeColumnProfiles(sampleData, columns);
    const numValsByCol = {};
    numColsList.forEach(c => { numValsByCol[c] = getColumnNumericValues(sampleData, c); });
    const missingCells = profiles.reduce((s, p) => s + p.missing, 0);
    const totalCells   = totalRows * totalCols;
    const missingPct   = totalCells > 0 ? ((missingCells / totalCells) * 100).toFixed(1) : '0.0';
    const completeness = (100 - parseFloat(missingPct)).toFixed(1);
    const profileCards = profiles.map(p => buildProfileCard(p, numValsByCol[p.col] || [])).join('');
    const heatmap = renderCorrelationHeatmap(sampleData, numColsList);
    const tableHTML = columns.length ? buildDataTable(displayedTableData, columns, maxRows) : '<div class="text-slate-400 text-sm italic">No data loaded.</div>';

    container.innerHTML = `
    <h2 class="text-6xl font-black tracking-tighter leading-none text-slate-900">Dataset Explorer</h2>
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col gap-1">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Rows</span>
            <span class="text-3xl font-black text-slate-900 leading-none">${totalRows.toLocaleString()}</span>
            <span class="text-[10px] text-slate-400 font-medium">records loaded</span>
        </div>
        <div class="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col gap-1">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Columns</span>
            <span class="text-3xl font-black text-slate-900 leading-none">${totalCols.toLocaleString()}</span>
            <span class="text-[10px] text-slate-400 font-medium">${numColsList.length} numeric · ${catColsList.length} categorical</span>
        </div>
        <div class="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col gap-1">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Data Completeness</span>
            <span class="text-3xl font-black ${parseFloat(completeness) >= 90 ? 'text-emerald-600' : parseFloat(completeness) >= 70 ? 'text-amber-600' : 'text-red-600'} leading-none">${completeness}%</span>
            <div class="w-full h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                <div class="h-full rounded-full transition-all duration-700 ${parseFloat(completeness) >= 90 ? 'bg-emerald-400' : parseFloat(completeness) >= 70 ? 'bg-amber-400' : 'bg-red-400'}" style="width:${completeness}%"></div>
            </div>
        </div>
        <div class="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col gap-1">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Missing Cells</span>
            <span class="text-3xl font-black text-slate-900 leading-none">${missingCells.toLocaleString()}</span>
            <span class="text-[10px] text-slate-400 font-medium">${missingPct}% of ${totalCells.toLocaleString()} total cells</span>
        </div>
    </div>
    <div>
        <div class="flex items-center justify-between mb-4">
            <div>
                <h3 class="text-2xl font-black text-slate-900 tracking-tight">Column Profiles</h3>
                <p class="text-xs text-slate-400 mt-0.5 font-medium">Summary statistics for each column (sampled from up to 3,000 rows)</p>
            </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            ${profileCards || '<p class="text-slate-400 text-sm italic col-span-4">No columns detected.</p>'}
        </div>
    </div>
    ${numColsList.length >= 2 ? heatmap : ''}
    <div>
        <div class="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div>
                <h3 class="text-2xl font-black text-slate-900 tracking-tight">Raw Data Table</h3>
                <p id="explorer-row-count" class="text-xs text-slate-400 mt-0.5 font-medium">
                    ${Math.min(maxRows, displayedTableData.length).toLocaleString()} of ${displayedTableData.length.toLocaleString()} rows
                </p>
            </div>
            <div class="flex items-center gap-2">
                <div class="relative">
                    <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-base pointer-events-none">search</span>
                    <input type="text" id="explorer-search" placeholder="Search rows…" oninput="explorerSearch(this.value)"
                        class="pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all w-52 shadow-sm"/>
                </div>
                <span class="text-[10px] font-bold text-slate-400">Click headers to sort</span>
            </div>
        </div>
        <div id="explorer-table-container">${tableHTML}</div>
        ${totalRows > maxRows ? `<div class="mt-3 text-center text-xs font-bold text-slate-400">Showing first ${maxRows.toLocaleString()} of ${totalRows.toLocaleString()} rows.</div>` : ''}
    </div>`;
}

function updateChart(id, type, labels, datasets, keepRatio = false) {
    const canvas = document.getElementById(id);
    if (!canvas) return;
    const existing = Chart.getChart(id);
    if (existing) existing.destroy();
    canvas.style.opacity = '0.5';
    setTimeout(() => { canvas.style.opacity = '1'; }, 150);
    let scales = {};
    if (type === 'bar') {
        scales = { x: { ticks: { maxRotation: 35, font: { size: 10 } } }, y: { ticks: { callback: v => fmt(v) } } };
    } else if (type === 'scatter') {
        scales = { x: { type: 'linear', ticks: { callback: v => fmt(v) } }, y: { type: 'linear', ticks: { callback: v => fmt(v) } } };
    }
    new Chart(canvas, {
        type, data: { labels, datasets },
        options: {
            maintainAspectRatio: keepRatio, responsive: true,
            plugins: { legend: { display: type === 'doughnut' }, tooltip: { callbacks: { label: ctx => {
                if (type === 'scatter') return ` (${fmt(ctx.raw?.x)}, ${fmt(ctx.raw?.y)})`;
                const v = ctx.parsed?.y ?? ctx.parsed;
                return typeof v === 'number' ? ` ${fmt(v)}` : ` ${v}`;
            }}}}
            , scales
        }
    });
}

function showChartPlaceholder(chartId, placeholderId, subtitleId, subtitleText, descId) {
    document.getElementById(subtitleId).innerText = subtitleText;
    document.getElementById(placeholderId).classList.remove('hidden');
    document.getElementById(chartId).classList.add('hidden');
    if (descId) document.getElementById(descId).classList.add('opacity-0');
}

function showChart(chartId, placeholderId) {
    document.getElementById(placeholderId).classList.add('hidden');
    document.getElementById(chartId).classList.remove('hidden');
}

function drawBarChart(info, metricCol) {
    const colType = getColumnType(globalData, metricCol);
    if (colType === 'numeric') {
        const validRows = globalData.map(row => ({ row, value: toFiniteNumber(row?.[metricCol]) }))
            .filter(item => item.value !== null).sort((a, b) => b.value - a.value).slice(0, 10);
        document.getElementById('bar-subtitle').innerText = `Metric: ${metricCol}`;
        if (!validRows.length) { showChartPlaceholder('barChart', 'bar-placeholder', 'bar-subtitle', `No valid values in: ${metricCol}`, 'desc-bar'); return; }
        showChart('barChart', 'bar-placeholder');
        const labels = validRows.map(item => getRowLabel(item.row, info));
        const values = validRows.map(item => item.value);
        updateChart('barChart', 'bar', labels, [{ label: metricCol, data: values, backgroundColor: labels.map((_, i) => `rgba(37,99,235,${1 - i * 0.07})`), borderRadius: 8 }]);
        const desc = document.getElementById('desc-bar');
        desc.classList.remove('opacity-0');
        desc.innerHTML = `Top: <span class="highlight">${escapeHtml(labels[0])}</span> with <span class="highlight">${fmt(values[0])}</span>. Top 10 by <em>${escapeHtml(metricCol)}</em> out of ${globalData.length.toLocaleString()} rows.`;
    } else {
        const freqs = getCategoryFrequencies(globalData, metricCol).slice(0, 10);
        document.getElementById('bar-subtitle').innerText = `Category Frequency: ${metricCol}`;
        if (!freqs.length) { showChartPlaceholder('barChart', 'bar-placeholder', 'bar-subtitle', `No valid categories in: ${metricCol}`, 'desc-bar'); return; }
        showChart('barChart', 'bar-placeholder');
        const labels = freqs.map(f => f.label);
        const values = freqs.map(f => f.count);
        updateChart('barChart', 'bar', labels, [{ label: `Count of ${metricCol}`, data: values, backgroundColor: labels.map((_, i) => `rgba(245,158,11,${1 - i * 0.07})`), borderRadius: 8 }]);
        const desc = document.getElementById('desc-bar');
        desc.classList.remove('opacity-0');
        desc.innerHTML = `Most frequent: <span class="highlight">${escapeHtml(labels[0])}</span> appears <span class="highlight">${values[0].toLocaleString()}x</span> (${((values[0] / globalData.length) * 100).toFixed(1)}% of rows).`;
    }
}

function drawDoughnut(info, metricCol) {
    const colType = getColumnType(globalData, metricCol);
    const PALETTE = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#131b2e'];
    if (colType === 'numeric') {
        const validRows = globalData.map(row => ({ row, value: toFiniteNumber(row?.[metricCol]) }))
            .filter(item => item.value !== null && item.value > 0).sort((a, b) => b.value - a.value);
        document.getElementById('doughnut-subtitle').innerText = `Distribution: ${metricCol}`;
        if (!validRows.length) { showChartPlaceholder('doughnutChart', 'doughnut-placeholder', 'doughnut-subtitle', MSG_DIST_POSITIVE, 'desc-doughnut'); return; }
        showChart('doughnutChart', 'doughnut-placeholder');
        const top5 = validRows.slice(0, 5);
        const labels = top5.map(item => getRowLabel(item.row, info));
        const values = top5.map(item => item.value);
        const others = validRows.slice(5);
        const othersSum = others.reduce((s, item) => s + item.value, 0);
        if (others.length && othersSum > 0) { labels.push('Others'); values.push(othersSum); }
        updateChart('doughnutChart', 'doughnut', labels, [{ data: values, backgroundColor: PALETTE, borderWidth: 2, borderColor: '#fff' }], true);
        const total = values.reduce((s, v) => s + v, 0);
        const topPct = total > 0 ? ((values[0] / total) * 100).toFixed(1) : '0.0';
        const desc = document.getElementById('desc-doughnut');
        desc.classList.remove('opacity-0');
        desc.innerHTML = `<span class="highlight">${escapeHtml(labels[0])}</span> makes up <span class="highlight">${topPct}%</span> of the visible distribution.`;
    } else {
        const freqs = getCategoryFrequencies(globalData, metricCol);
        document.getElementById('doughnut-subtitle').innerText = `Category Share: ${metricCol}`;
        if (!freqs.length) { showChartPlaceholder('doughnutChart', 'doughnut-placeholder', 'doughnut-subtitle', `No valid categories in: ${metricCol}`, 'desc-doughnut'); return; }
        showChart('doughnutChart', 'doughnut-placeholder');
        const top5 = freqs.slice(0, 5);
        const labels = top5.map(f => f.label);
        const values = top5.map(f => f.count);
        const othersSum = freqs.slice(5).reduce((s, f) => s + f.count, 0);
        if (othersSum > 0) { labels.push('Others'); values.push(othersSum); }
        updateChart('doughnutChart', 'doughnut', labels, [{ data: values, backgroundColor: PALETTE, borderWidth: 2, borderColor: '#fff' }], true);
        const total = values.reduce((s, v) => s + v, 0);
        const topPct = total > 0 ? ((values[0] / total) * 100).toFixed(1) : '0.0';
        const desc = document.getElementById('desc-doughnut');
        desc.classList.remove('opacity-0');
        desc.innerHTML = `<span class="highlight">${escapeHtml(labels[0])}</span> is the most common category at <span class="highlight">${topPct}%</span>.`;
    }
}

function drawScatterPlot(info, metricCol, xCol) {
    document.getElementById('scatter-subtitle').innerText = `X: ${xCol}  ->  Y: ${metricCol}`;
    if (!isColumnNumeric(globalData, xCol) || !isColumnNumeric(globalData, metricCol)) {
        showChartPlaceholder('scatterPlot', 'scatter-placeholder', 'scatter-subtitle', 'Scatter plot requires two numeric columns.', 'desc-scatter');
        return;
    }
    const allPairs = getNumericPairs(globalData, xCol, metricCol);
    if (!allPairs.length) { showChartPlaceholder('scatterPlot', 'scatter-placeholder', 'scatter-subtitle', `No overlapping data for: ${xCol} vs ${metricCol}`, 'desc-scatter'); return; }
    const step = Math.max(1, Math.ceil(allPairs.length / MAX_SCATTER_POINTS));
    const scatterData = [];
    for (let i = 0; i < allPairs.length && scatterData.length < MAX_SCATTER_POINTS; i += step) {
        scatterData.push({ x: allPairs[i].x, y: allPairs[i].y });
    }
    showChart('scatterPlot', 'scatter-placeholder');
    updateChart('scatterPlot', 'scatter', [], [{ label: `${xCol} vs ${metricCol}`, data: scatterData, backgroundColor: 'rgba(37,99,235,0.45)', pointRadius: 4 }]);
    const desc = document.getElementById('desc-scatter');
    desc.classList.remove('opacity-0');
    desc.innerHTML = `<span class="highlight">${escapeHtml(xCol)}</span> (X) vs <span class="highlight">${escapeHtml(metricCol)}</span> (Y) — <span class="highlight">${scatterData.length}</span> sampled points from <span class="highlight">${allPairs.length}</span> valid pairs.`;
}

function initCharts(info, metricCol, xCol) {
    drawBarChart(info, metricCol);
    drawDoughnut(info, metricCol);
    if (xCol) drawScatterPlot(info, metricCol, xCol);
}

function buildColumnSelector(info) {
    const panel = document.getElementById('col-selector-panel');
    panel.classList.remove('hidden');
    panel.style.display = 'flex';
    const sampleRows = globalData.slice(0, 500);
    const columnHasNumericData = col => sampleRows.some(r => toFiniteNumber(r?.[col]) !== null);
    const allSelectable = info.allSelectableCols || [...(info.numericCols || []), ...(info.categoricalCols || [])];
    if (info.format === 'wide') {
        const sortedYears = [...(info.yearCols || [])].filter(c => /^\d{4}$/.test(c)).sort((a, b) => +b - +a);
        if (!selectedMetricCol || !columnHasNumericData(selectedMetricCol)) {
            selectedMetricCol = sortedYears.find(columnHasNumericData) || info.yearCols?.[info.yearCols.length - 1];
        }
        const ascYears = [...sortedYears].reverse();
        if (!selectedXCol || !columnHasNumericData(selectedXCol) || selectedXCol === selectedMetricCol) {
            selectedXCol = ascYears.find(c => c !== selectedMetricCol && columnHasNumericData(c)) || ascYears.find(columnHasNumericData) || selectedMetricCol;
        }
    } else {
        if (!selectedMetricCol || !allSelectable.includes(selectedMetricCol)) {
            selectedMetricCol = info.numericCols?.[info.numericCols.length - 1] || allSelectable[0];
        }
        if (!selectedXCol || !allSelectable.includes(selectedXCol) || selectedXCol === selectedMetricCol) {
            selectedXCol = (info.numericCols || []).find(c => c !== selectedMetricCol) || allSelectable.find(c => c !== selectedMetricCol) || allSelectable[0];
        }
    }
    const btnRow = document.getElementById('col-btn-row');
    btnRow.innerHTML = '';
    allSelectable.slice(0, 80).forEach(col => {
        const isCat = !isColumnNumeric(globalData.slice(0, 200), col);
        const btn = document.createElement('button');
        btn.className = 'col-select-btn' + (isCat ? ' categorical' : '') + (col === selectedMetricCol ? ' selected' : '');
        btn.textContent = col;
        btn.title = isCat ? 'Categorical — shows frequency chart' : 'Numeric column';
        btn.onclick = () => {
            selectedMetricCol = col;
            document.querySelectorAll('#col-btn-row .col-select-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            refreshCharts();
        };
        btnRow.appendChild(btn);
    });
    const scatterXRow = document.getElementById('scatter-x-row');
    const scatterXBtnRow = document.getElementById('scatter-x-btn-row');
    const numericForX = info.numericCols || [];
    if (numericForX.length >= 2) {
        scatterXRow.classList.remove('hidden');
        scatterXRow.style.display = 'flex';
        scatterXBtnRow.innerHTML = '';
        numericForX.slice(0, 80).forEach(col => {
            const btn = document.createElement('button');
            btn.className = 'col-select-btn' + (col === selectedXCol ? ' selected' : '');
            btn.textContent = col;
            btn.onclick = () => {
                selectedXCol = col;
                document.querySelectorAll('#scatter-x-btn-row .col-select-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                refreshCharts();
            };
            scatterXBtnRow.appendChild(btn);
        });
    } else {
        scatterXRow.classList.add('hidden');
        selectedXCol = numericForX[0] || null;
    }
}

function setElementMessage(id, message) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = `<span class="text-slate-500 text-sm italic">${escapeHtml(message)}</span>`;
}

function getMetricSummary(data, metricCol) {
    const values = getColumnNumericValues(data, metricCol);
    if (!values.length) return null;
    return { count: values.length, mean: mean(values), min: Math.min(...values), max: Math.max(...values), sd: values.length > 1 ? stdDev(values) : 0 };
}

function getPairSummary(data, xKey, yKey) {
    if (!isColumnNumeric(data, xKey) || !isColumnNumeric(data, yKey)) return { ok: false, message: MSG_NEEDS_NUMERIC };
    const pairs = getNumericPairs(data, xKey, yKey);
    if (pairs.length < 2) return { ok: false, message: MSG_NEEDS_PAIRS };
    const xVals = pairs.map(p => p.x);
    const yVals = pairs.map(p => p.y);
    const correlation = pearsonCorr(xVals, yVals);
    if (correlation === null) return { ok: false, message: MSG_NEEDS_VARIATION };
    const regression = linearRegression(xVals, yVals);
    if (!regression || regression.r2 === null) return { ok: false, message: MSG_NEEDS_VARIATION };
    return { ok: true, pairs, xVals, yVals, correlation, regression };
}

function renderAnalysis(data) {
    const colType = getColumnType(data, selectedMetricCol);
    if (colType !== 'numeric') { setElementMessage('desc-stats-content', MSG_NEEDS_NUMERIC); }
    else {
        const summary = getMetricSummary(data, selectedMetricCol);
        if (!summary) { setElementMessage('desc-stats-content', MSG_NEEDS_NUMERIC); }
        else {
            document.getElementById('desc-stats-content').innerHTML = `
                <div class="grid grid-cols-2 gap-y-4 gap-x-8 w-full mt-2 text-slate-700">
                    <div class="flex justify-between border-b border-slate-100 pb-1"><span class="font-bold text-slate-400 text-xs uppercase">Sample (N)</span><span class="font-black">${summary.count.toLocaleString()}</span></div>
                    <div class="flex justify-between border-b border-slate-100 pb-1"><span class="font-bold text-slate-400 text-xs uppercase">Mean</span><span class="font-black text-blue-600">${fmt(summary.mean)}</span></div>
                    <div class="flex justify-between border-b border-slate-100 pb-1"><span class="font-bold text-slate-400 text-xs uppercase">Minimum</span><span class="font-black">${fmt(summary.min)}</span></div>
                    <div class="flex justify-between border-b border-slate-100 pb-1"><span class="font-bold text-slate-400 text-xs uppercase">Maximum</span><span class="font-black">${fmt(summary.max)}</span></div>
                    <div class="col-span-2 flex justify-between pt-1"><span class="font-bold text-slate-400 text-xs uppercase">Std Deviation</span><span class="font-black text-blue-600">${fmt(summary.sd)}</span></div>
                </div>`;
        }
    }
    const pairSummary = getPairSummary(data, selectedXCol, selectedMetricCol);
    if (!pairSummary.ok) {
        setElementMessage('lr-content', pairSummary.message);
        setElementMessage('corr-content', pairSummary.message);
        document.getElementById('lr-confidence').innerText = 'N/A';
        return;
    }
    const r = pairSummary.correlation;
    const lr = pairSummary.regression;
    const strength = Math.abs(r) > 0.7 ? 'Strong' : Math.abs(r) > 0.4 ? 'Moderate' : 'Weak';
    const direction = r >= 0 ? 'Positive' : 'Negative';
    document.getElementById('corr-content').innerHTML = `
        <div class="flex items-center gap-6 mt-4 text-slate-700">
            <div class="bg-emerald-50 rounded-2xl p-4 flex-shrink-0 min-w-[130px] text-center border border-emerald-100">
                <p class="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Pearson r</p>
                <p class="text-3xl font-black text-emerald-700">${r.toFixed(4)}</p>
            </div>
            <div class="text-sm font-medium text-slate-600 leading-relaxed">
                Evaluated against <strong class="text-slate-900">${escapeHtml(selectedXCol)}</strong>.<br>
                Detecting a <strong class="text-emerald-700">${strength}</strong>, <strong class="text-emerald-700">${direction}</strong> linear relationship.
                <span class="text-slate-400 text-xs block mt-1">n = ${lr.sampleSize.toLocaleString()} valid pairs</span>
            </div>
        </div>`;
    document.getElementById('lr-content').innerHTML = `
        <div class="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-4 text-center mt-2 text-slate-700">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Equation (y = mx + b)</p>
            <p class="text-lg font-black font-mono text-slate-800 tracking-tight">y = ${fmt(lr.slope)}x ${lr.intercept >= 0 ? '+' : '-'} ${fmt(Math.abs(lr.intercept))}</p>
        </div>
        <div class="grid grid-cols-2 gap-4 text-slate-700">
            <div class="flex justify-between border-b border-slate-100 pb-1"><span class="font-bold text-slate-400 text-[10px] uppercase">Slope (m)</span><span class="font-black text-sm">${fmt(lr.slope)}</span></div>
            <div class="flex justify-between border-b border-slate-100 pb-1"><span class="font-bold text-slate-400 text-[10px] uppercase">Intercept (b)</span><span class="font-black text-sm">${fmt(lr.intercept)}</span></div>
        </div>`;
    document.getElementById('lr-confidence').innerHTML = `R&sup2; = ${lr.r2.toFixed(4)}`;
}

function renderInsights(data) {
    const pairSummary = getPairSummary(data, selectedXCol, selectedMetricCol);
    if (!pairSummary.ok) { setElementMessage('insights-content', pairSummary.message); return; }
    const { yVals, regression: lr } = pairSummary;
    const avg = mean(yVals);
    const sd  = stdDev(yVals);
    const cv  = Math.abs(avg) > Number.EPSILON ? sd / Math.abs(avg) : null;
    const variabilityDesc = cv === null ? 'centered around zero' : cv > 1 ? 'highly volatile' : cv > 0.5 ? 'moderately variable' : 'relatively stable';
    const cvText = cv === null ? 'N/A (mean near 0)' : `${(cv * 100).toFixed(1)}%`;
    document.getElementById('insights-content').innerHTML = `
        <div class="text-slate-600 text-sm font-medium leading-relaxed w-full mt-2">
            <p class="mb-3">The metric <strong class="text-blue-600">${escapeHtml(selectedMetricCol)}</strong> is <strong>${variabilityDesc}</strong> (CV: ${cvText}).</p>
            <p>The regression model explains <strong class="text-blue-600">${(lr.r2 * 100).toFixed(1)}%</strong> of the variance in the target. For every unit increase in <em>${escapeHtml(selectedXCol)}</em>, the target shifts by an estimated <strong>${fmt(lr.slope)}</strong> units.</p>
        </div>`;
}

function renderAnalysisTextOnly() {
    document.getElementById('desc-stats-content').innerHTML =
        `Dataset contains <span class="font-bold text-blue-600">${globalData.length.toLocaleString()}</span> records, but no aggregatable numeric targets.`;
    ['lr-content', 'corr-content', 'insights-content'].forEach(id => setElementMessage(id, MSG_NEEDS_NUMERIC));
    document.getElementById('lr-confidence').innerText = 'Inactive';
}

let refreshRequestId = 0;
let refreshFeedbackTimeout = null;

function pulseRefreshButton() {
    const btn = document.getElementById('refresh-btn');
    if (!btn) return;
    btn.innerText = '✓ Updated';
    btn.classList.replace('bg-blue-600', 'bg-emerald-500');
    btn.classList.replace('hover:bg-blue-700', 'hover:bg-emerald-600');
    if (refreshFeedbackTimeout) clearTimeout(refreshFeedbackTimeout);
    refreshFeedbackTimeout = setTimeout(() => {
        btn.innerText = '↻ Refresh Charts';
        btn.classList.replace('bg-emerald-500', 'bg-blue-600');
        btn.classList.replace('hover:bg-emerald-600', 'hover:bg-blue-700');
    }, 900);
}

async function refreshCharts() {
    if (!currentInfo || !selectedMetricCol) return;
    const requestId = ++refreshRequestId;
    pulseRefreshButton();
    const xCol = selectedXCol || (currentInfo.numericCols || []).find(c => c !== selectedMetricCol) || (currentInfo.numericCols || [])[0];
    await yieldToBrowser();
    if (requestId !== refreshRequestId) return;
    initCharts(currentInfo, selectedMetricCol, xCol);
    await yieldToBrowser(globalData.length > 5000 ? 40 : 0);
    if (requestId !== refreshRequestId) return;
    renderAnalysis(globalData);
    await yieldToBrowser();
    if (requestId !== refreshRequestId) return;
    renderInsights(globalData);
}

async function onDataReady() {
    if (!globalData.length) return;
    const info = detectDatasetFormat(globalData);
    currentInfo = info;
    const warningSlot = document.getElementById('warning-slot');
    warningSlot.innerHTML = '';
    renderExplorerTable(globalData, TABLE_MAX_ROWS);
    if (info.format === 'text-only' || info.format === 'empty') {
        if (info.format === 'text-only' && (info.categoricalCols || []).length > 0) {
            warningSlot.innerHTML = `<div class="info-banner"><span class="material-symbols-outlined text-xl flex-shrink-0">info</span>No numeric columns detected — showing category frequency charts.</div>`;
            selectedMetricCol = info.categoricalCols[0];
            selectedXCol = info.categoricalCols[1] || info.categoricalCols[0];
            buildColumnSelector(info);
            await yieldToBrowser();
            await refreshCharts();
        } else {
            warningSlot.innerHTML = `<div class="warning-banner"><span class="material-symbols-outlined text-xl flex-shrink-0">warning</span><div><strong>No usable columns detected.</strong></div></div>`;
            renderAnalysisTextOnly();
        }
        return;
    }
    if (info.format === 'wide') {
        warningSlot.innerHTML = `<div class="info-banner"><span class="material-symbols-outlined text-xl flex-shrink-0">info</span>Wide-format dataset detected — select a year column below and click <strong>Refresh Charts</strong>.</div>`;
    }
    if (!selectedMetricCol || !(info.allSelectableCols || []).includes(selectedMetricCol)) {
        selectedMetricCol = (info.numericCols || [])[info.numericCols.length - 1] || (info.categoricalCols || [])[0];
    }
    if (!selectedXCol || !(info.numericCols || []).includes(selectedXCol) || selectedXCol === selectedMetricCol) {
        selectedXCol = (info.numericCols || []).find(c => c !== selectedMetricCol) || (info.numericCols || [])[0];
    }
    buildColumnSelector(info);
    await yieldToBrowser(globalData.length > 5000 ? 60 : 0);
    await refreshCharts();
}

proceedBtn.addEventListener('click', () => {
    notifModal.classList.add('hidden');
    if (confirmCallback) confirmCallback();
});
document.getElementById('notif-close').addEventListener('click', () => notifModal.classList.add('hidden'));

function switchView(target) {
    ['explorer', 'viz', 'stats'].forEach(id => {
        const navBtn  = document.getElementById('nav-' + id);
        const viewDiv = document.getElementById('view-' + id);
        if (id === target) {
            navBtn.classList.add('active-nav');
            viewDiv.classList.replace('hidden-tab', 'visible-tab');
        } else {
            navBtn.classList.remove('active-nav');
            viewDiv.classList.replace('visible-tab', 'hidden-tab');
        }
    });
}

function clearSystem() { location.reload(); }

// =====================================================================
// BOOTSTRAP — runs once the DOM is ready
// Calls loadEmbeddedDataset so the explorer and charts initialise
// automatically without requiring the user to click LOAD DATASET.
// =====================================================================
document.addEventListener('DOMContentLoaded', () => {
    if (typeof globalData !== 'undefined' && globalData.length === 0) {
        loadEmbeddedDataset('EdStats Data');
    }
});