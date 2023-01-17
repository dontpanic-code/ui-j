import { Component, OnInit, ViewChild } from '@angular/core';
import {MatAccordion, MatExpansionPanel} from '@angular/material/expansion';
import { MatCard } from '@angular/material/card';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { HireServiceService } from '@app/pages/hire-list/hire-service.service';

@Component({
  selector: 'app-help-data-table',
  templateUrl: './help-data-table.component.html',
  styleUrls: ['./help-data-table.component.scss']
})

export class HelpDataTableComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  
  currentTypes = []
  currentStates = []

  helpDataTable = [
    {
      'name': 'Donations',
      'links':[
        {'link': 'https://savelife.in.ua/donate/', 'descript': 'найбільший благодійний фонд допомоги українській армії', 'name': '"Повернись живим"'},
        {'link': 'https://www.comebackalive.in.ua/donate', 'descript': 'international charitable foundation', 'name': 'COME BACK ALIVE'},
      ],
    },
    {
      'name': 'Фіксація та повідомлення про злочини окупантів',
      'links':[
        {'link': 'https://t.me/stop_russian_war_bot', 'descript': 'Повідомлення місць дислокації, пересування, обсягів військової техніки та особового складу окупанта', 'name': '@stop_russian_war_bot (Телеграм)'},
        {'link': 'https://t.me/ukraine_avanger_bot', 'descript': 'Сюди українці можуть надсилати інформацію про ворожі мітки на дорогах країни та пересування військ окупанта', 'name': '@ukraine_avanger_bot (Телеграм)'},
        {'link': 'https://t.me/EcoShkodaBot', 'descript': 'Фіксація збитків, заподіяних довкіллю України військами окупанта', 'name': '@EcoShkodaBot (Телеграм)'},
        {'link': 'https://t.me/tribunal_ua_bot', 'descript': 'Фіксація злочинів проти громадян та мешканців України, вчинених рос. армією', 'name': '@tribunal_ua_bot (Телеграм)'},
        {'link': 'mailto:otp.informationdesk@icc-cpi.int', 'descript': 'Пошта Міжнародного кримінального суду в Гаазі', 'name': 'otp.informationdesk@icc-cpi.int'},
        {'link': 'mailto:ohchr-hrmmu@un.org', 'descript': 'Моніторингова місія ООН з прав людини: прийом та фіксація повідомлень про жорстоке поводження з полоненими — приниження, тортури тощо. Інформація про можливі порушення міжнародного права, прав людини та міжнародного гуманітарного права стосовно військових, взятих у полон з 24 лютого 2022 року (незалежно від приналежності ймовірних порушників або жертв)', 'name': 'ohchr-hrmmu@un.org'},
        {'link': 'https://warcrimes.gov.ua', 'descript': 'Якщо ви стали потерпілим або свідком воєнних злочинів Росії проти цивільного населення, фіксуйте та надсилайте докази!', 'name': 'WarCrimes'},
        {'link': 'https://culturecrimes.mkip.gov.ua', 'descript': 'Сайт для фіксації злочинів проти культурної спадщини України', 'name': 'CultureCrimes'},
        {'link': 'https://dokaz.gov.ua/', 'descript': 'Порушення прав, злочини, збитки, спричинені окупантами', 'name': 'Dokaz'},
      ],
    },    
    {
      'name': 'Територіальна Оборона',
      'links':[
        {'link': 'https://sprotyv.in.ua/', 'descript': 'Записатися до Територіальної Оборони ЗСУ', 'name': 'Sprotyv'},
      ],
    },
    {
      'name': 'Медична допомога',
      'links':[
        {'link': 'https://t.me/FastAid_bot', 'descript': 'Покрокові інструкції з надання допомоги до приїзду швидкої', 'name': '@FastAid_bot (Телеграм)'},
        {'link': 'https://t.me/Doc2rbot', 'descript': 'Знайти лікаря і отримати медичну допомогу', 'name': '@Doc2rbot (Телеграм)'},
        {'link': 'https://docs.google.com/document/d/1X0rfJtR6wpJHP2Xds7lzDa1-Fkb1W2q85p_zOyhoyoo/edit?fbclid=IwAR0YUiIkodqpibjoAXVT3J2_vUaJ5w7ZJOGBKWdRWxzdH-X0h6oVw1P_OuU#heading=h.2n69xe2dg7hr', 'descript': 'База лікарів, що допомагають українцям у час війни', 'name': 'База лікарів (GoogleDocs)'},
        {'link': 'https://cutt.ly/xApEGvZ', 'descript': 'чат бот ДСНС (WhatsApp)', 'name': 'ДСНС'},
        {'link': 'tel:0800331800', 'descript': 'Лінія підтримки Червоного Хреста «Давай поговоримо» (0 800 331 800)', 'name': '«Давай поговоримо»'},
        {'link': 'https://bit.ly/apteky_insul', 'descript': 'Перелік аптек з інсуліном', 'name': 'Аптеки з інсуліном 1'},
        {'link': 'https://tabletki.ua/uk/', 'descript': 'Перелік аптек з інсуліном', 'name': 'Аптеки з інсуліном 2'},
      ],
    },
    {
      'name': 'Житло',
      'links':[
        {'link': 'https://t.me/shelter_for_ukrainians_bot', 'descript': 'Знайти житло або надати притулок', 'name': '@shelter_for_ukrainians_bot'},
        {'link': 'https://t.me/turbotnyk_bo', 'descript': 'Цілодобово допомагає українським переселенцям отримати тимчасову домівку та необхідні речі у ЦНАПах, що працюють як пункти турботи', 'name': '@turbotnyk_bo (Телеграм)'},
        {'link': 'https://t.me/saveua_bot', 'descript': 'Знайти/надати допомогу в різних регіонах України: транспорт, їжу, медикаменти тощо', 'name': '@saveua_bot (Телеграм)'},
        {'link': 'https://icanhelp.host/', 'descript': 'Допомогти з житлом тим, хто його потребує', 'name': 'ICanHelp'},
      ],
    },
    {
      'name': 'Волонтери',
      'links':[
        {'link': 'https://t.me/donorua', 'descript': 'Стати донором крові', 'name': '@donorua (Телеграм)'},
        {'link': 'https://t.me/cresume', 'descript': 'Волонтерство/вакансі', 'name': '@cresume (Телеграм)'},
        {'link': 'https://t.me/Kyiv_volunteer_bot', 'descript': 'Чатбот, що об’єднує людей, які хочуть передати допомогу та людей, які зможуть її доставити', 'name': '@Kyiv_volunteer_bot (Телеграм)'},
        {'link': 'https://docs.google.com/document/d/10Vd237ExLs5lmh5vszACiphctOHZS5a98bWMlGfRCOc/mobilebasic', 'descript': 'Список волонтерських чатів у містах України', 'name': 'Волонтерські чати (GoogleDocs)'},
      ],
    },
    {
      'name': 'Дітям',
      'links':[
        {'link': 'https://life.pravda.com.ua/society/2022/03/2/247633/ ', 'descript': 'Онлайн-платформа для навчання та психологічної підтримки школярів від Наукового ліцею Чурюмова', 'name': 'Навчання та психологічна підтримка школярів'},
        {'link': 'http://www.barabooka.com.ua/yak-dopomagati-dityam-u-zamknenomu-prostori/', 'descript': 'Дитячі книги в електронному форматі', 'name': 'Barabooka'},
        {'link': 'https://t.me/pavlushaiyava', 'descript': 'Телеграм', 'name': 'Аудіоказки @pavlushaiyava'},
        {'link': 'https://t.me/kazky_ukr', 'descript': 'Телеграм', 'name': 'Аудіоказки @kazky_ukr'},
        {'link': 'https://megogo.net/ua/search-extended?category_id=mult&main_tab=filters&sort=popular&vod_free=true', 'descript': 'Мультфільми від Megogo', 'name': 'Megogo'},
      ],
    },
    {
      'name': 'Знайти зниклих',
      'links':[
        {'link': 'https://t.me/poshuk_znyklyh', 'descript': 'Канал, де шукають і знаходять зниклих', 'name': '@poshuk_znyklyh (Телеграм)'},
        {'link': 'mailto:united.centre.ssu@gmail.com', 'descript': '+38 067 650 83 32 та +38 098 087 36, united.centre.ssu@gmail.com', 'name': 'Об’єднаний центр з пошуку та звільнення полонених'},
        {'link': 'tel:0800300155', 'descript': 'Міжнародний комітет Червоного Хреста в Україні: 0 800 300 155', 'name': 'Червоний Хрест'},
        {'link': 'tel:0800332656', 'descript': 'Інформаційний центр Товариства Червоного Хреста в Україні:  0 800 332 656', 'name': 'Червоний Хрест'},
        {'link': 'tel:0800339247', 'descript': 'неполітична громадська організація, одним з напрямків роботи якої є звільнення військовополонених та заручників. Номер гарячої лінії для повідомлень:  0 800 339 247', 'name': 'Громадська організація «Група Патріот»'},
        {'link': 'tel:0978423315', 'descript': 'Відділ пошуку визволення полонених Генерального Штабу ЗСУ допомагає з пошуком полонених як серед військових, так і цивільних. Телефон для зв’язку: +38 097 842 3315', 'name': 'Відділ пошуку визволення полонених Генерального Штабу ЗСУ'},
      ],
    },
    {
      'name': 'Транспорт + виїзд за кордон',
      'links':[
        {'link': 'hhttps://docs.google.com/spreadsheets/d/e/2PACX-1vTmKNAxZn2cPpBqPHnRx9Hc_GPzfi7U92h05hkNuES6pA8l7IcbfdRELMkTBWGcBFoRkUdwlnfX889X/pubhtml?gid=0&single=true&fbclid=IwAR0kJoMq9RrROw4cvn_cEXRnhKogLf35H9eoGul_sjjPorZc4sJFJGdcg0U', 'descript': 'черги на виїзд за кордон (Google Doc)', 'name': 'Моніторинг черг на кордоні'},
        {'link': 'https://t.me/huiiivoiiine ', 'descript': 'Знайти транспорт на виїзд за кордон', 'name': '@huiiivoiiine (Телеграм)'},
        {'link': 'https://t.me/nampodorozi_bot', 'descript': 'Допомога українцям з автівками та без знайти одне одног', 'name': '@nampodorozi_bot (Телеграм)'},
        {'link': 'https://uz-vezemo.com/', 'descript': 'Офіційний сайт', 'name': 'Укрзалізниця'},
        {'link': 'https://t.me/UkrzalInfo', 'descript': 'Офіційний телеграм канал', 'name': 'Укрзалізниця'},
      ],
    },
    {
      'name': 'Пошук роботи',
      'links':[
        {'link': 'https://t.me/workadojobs', 'descript': 'помічник у пошуку віддаленої та гібридної роботи ', 'name': 'Workado'},
        {'link': 'https://t.me/jobforukrainians', 'descript': 'Вакансії для українців за кордоном', 'name': '@jobforukrainians (Телеграм)'},
        {'link': 'https://t.me/uajobnow', 'descript': 'Допомога в працевлаштуванні під час війни. В Україні, Європі та дистанційно', 'name': '@uajobnow (Телеграм)'},
        {'link': 'https://t.me/helpukrainiansjooble', 'descript': 'Робота для біженців', 'name': '@helpukrainiansjooble (Телеграм)'},
        {'link': 'https://happymonday.ua/jobs-search', 'descript': 'Робота для українців', 'name': 'happymonday'},
      ],
    },
    {
      'name': 'Корисні застосунки',
      'links':[
        {'link': 'https://play.google.com/store/apps/details?id=com.ukrainealarm', 'descript': 'Google Play', 'name': 'Повітряна тривога'},
        {'link': 'https://apps.apple.com/ua/app/id1611955391', 'descript': 'App Store', 'name': 'Повітряна тривога'},
        {'link': 'https://play.google.com/store/apps/details?id=org.thoughtcrime.securesms', 'descript': 'Google Play', 'name': 'Месенджер Signal'},
        {'link': 'https://apps.apple.com/ru/app/id874139669', 'descript': 'App Store', 'name': 'Месенджер Signal'},
        {'link': 'https://play.google.com/store/apps/details?id=ua.yakaboo&hl=uk&gl=US', 'descript': 'безкоштовні книги онлайн (Google Play)', 'name': 'Yakaboo'},
        {'link': 'https://apps.apple.com/ua/app/yakaboo/id1558352848', 'descript': 'безкоштовні книги онлайн (App Store)', 'name': 'Yakaboo'},
      ],
    },
    {
      'name': 'Подкаст про війну "Право на поплаву"',
      'links':[
        {'link': 'https://podcasts.apple.com/mt/podcast/id1613491809', 'descript': 'Подкаст, який виник як аудіо-простір в українському твіттері. У ньому керівник фонду «Повернись живим» Тарас Чмут разом з командою відповідають на запитання твітерян про ситуацію на війні', 'name': 'Подкаст про війну "Право на поплаву"'},
      ],
    },
    {
      'name': 'Інші корисні лінки',
      'links':[
        {'link': 'https://t.me/kartamapa_org_bot', 'descript': 'Знайти місце, де сховатись під час повітряної тривоги, найближчу працюючу аптеку або магазин', 'name': '@kartamapa_org_bot (Телеграм)'},
        {'link': 'https://wifi.kyivcity.gov.ua/', 'descript': 'Заявка на Wi-Fi в укриттях ', 'name': 'WiFi'},
        {'link': 'https://www.npu.gov.ua/news/stoprussia/Informacziya-shhodo-dodatkovix-telefoniv-policziji-u-vsix-regionax-derzhavi-onovleno-stanom-na-09-03/ ', 'descript': 'Телефони поліції у всіх регіонах держави ', 'name': 'Поліція'},
        {'link': 'https://www.mywar.in.ua', 'descript': 'Платформа, яку запустило Міністерство культури та інформаційної політики України. Кожен українець може описати свою історію, викласти реальні факти та особисті переживання. А громадяни інших країн можуть побачити та прочитати їх рідними для них мовами і висловити свою підтримку Україні реальними діями', 'name': '#МояВійна'},
        {'link': 'https://t.me/+Uwb2IiL2F2LedA7f', 'descript': 'Телеграм-чат, де допомагають тваринам (ветеринари питання виїзду, допомога з притулками)', 'name': 'Допомога тваринам'},
        {'link': 'https://t.me/BlackBookRussians', 'descript': ' ресурс який володіє інформацією про усіх військових, правоохоронців та чиновників російської федерації', 'name': 'Чорна книга Росії'},
      ],
    },
    {
      'name': 'Допомога в інших країнах',
      'links':[
        {'link': 'https://t.me/refugeesinDenmark', 'descript': 'Телеграм', 'name': 'Данія '},
        {'link': 'https://t.me/refugeesinBelgium', 'descript': 'Телеграм', 'name': 'Бельгія '},
        {'link': 'https://t.me/refugeesinSwitzerland', 'descript': 'Телеграм', 'name': 'Швейцарія'},
        {'link': 'https://t.me/refugeesinPoland', 'descript': 'Телеграм', 'name': 'Польща'},
        {'link': 'https://t.me/refugeesinFrance', 'descript': 'Телеграм', 'name': 'Франція'},
        {'link': 'https://t.me/refugees_in_Germany', 'descript': 'Телеграм', 'name': 'Німеччина'},
        {'link': 'https://t.me/refugeesinSweden', 'descript': 'Телеграм', 'name': 'Швеція'},
        {'link': 'https://t.me/refugeesinAustria ', 'descript': 'Телеграм', 'name': 'Австрія '},
      ],
    },
    {
      'name': 'Офіційні акаунти та канали',
      'links':[
        {'link': 'https://www.facebook.com/president.gov.ua', 'Оперативна публікація звернень Володимира Олександровича, денна норма заспокійливого Арестовича і не тільки': 'Вибачте', 'name': 'Офіс Президента України'},
        {'link': 'https://www.facebook.com/GeneralStaff.ua', 'descript': 'Оперативна інформація щодо мертвої русні', 'name': 'Генеральний штаб Збройних Сил України'},
        {'link': ' https://www.facebook.com/KabminUA  ', 'descript': 'Першими пишуть про зміни у законодавстві, зокрема легалайз знищення русні цивільними', 'name': 'Кабінет Міністрів України'},
        {'link': 'https://www.facebook.com/MinistryofDefence.UA', 'descript': 'Facebook', 'name': 'Міністерство оборони України'},
        {'link': 'https://www.facebook.com/MNS.GOV.UA', 'descript': 'Гасять пожежі, розбирають завали, рятують життя українців', 'name': 'Державна служба надзвичайних ситуацій (ДСНС)'},
        {'link': 'https://www.facebook.com/DPSUkraine', 'descript': 'Facebook', 'name': 'Державна прикордонна служба України'},
        {'link': 'https://www.facebook.com/TerritorialDefenseForces', 'descript': 'Тут можна побачити як прості українці та українки відбирають русняву техніку, будують барикади та виготовляють коктейлі Молотова', 'name': 'Територіальна оборона ЗСУ'},
        {'link': 'https://www.facebook.com/navy.mil.gov.ua', 'descript': 'Тут прокладають шлях руським кораблям', 'name': 'Військово-морські сили ЗСУ'},
        {'link': 'https://t.me/miUkraune', 'descript': 'Безпечні маршрути Україною та варіанти виїзду за кордон, функціонування Укрпошти тощо', 'name': 'Міністерство інфраструктури України'},
        {'link': 'https://t.me/mintsyfra', 'descript': 'Знищення русні у кібервійні', 'name': 'Міністерство цифрової трансформації України'},
        {'link': 'https://t.me/operativnoZSU', 'descript': 'Нешаблонна подача актуальних та оперативних новин ЗС України, ситуації на фронті', 'name': 'Оперативний ЗСУ'},
      ],
    },
  ];

  constructor(public hireService: HireServiceService) { 

  }

  ngOnInit(): void {
  }

 

  isType(element){
    return this.currentTypes.length ? this.currentTypes.includes(element) : true
  }
  isState(element){
    return this.currentStates.length ? this.currentStates.includes(element) : true
  }

}
