import React, { PropsWithChildren } from "react";
import FilterPanel from "./FilterPanel";
import { DehydratedState, HydrationBoundary } from "@tanstack/react-query";
import ListProductCard from "./ListProductCard";
import FilterPopover from "../FilterPopover";

interface LayoutProductProps {
  dehydratedState: DehydratedState;
  queryKey: string;
}

export default function LayoutProduct({
  dehydratedState,
  queryKey,
}: PropsWithChildren<LayoutProductProps>) {

  return (
    <main className="container font-primary mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 lg:gap-8">
        <aside className="hidden lg:block lg:sticky lg:top-7 self-start">
          <FilterPanel />
        </aside>
        <section className="space-y-6 ">
          <div className="flex justify-start flex-row-reverse gap-2">
            <div className="lg:hidden flex   gap-2">
              <FilterPanel />
            </div>
            <FilterPopover />
          </div>
          <HydrationBoundary state={dehydratedState}>
            <div>
              10 products
            </div>
            <ListProductCard queryKey={queryKey} />
            <p>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Maiores esse alias pariatur dicta, atque rem iusto quaerat
                  autem magnam maxime numquam, harum consequuntur, expedita
                  officiis voluptate! Asperiores dicta repellat inventore?
                  Repudiandae obcaecati voluptate vero nesciunt voluptates cum
                  molestias incidunt. Culpa, blanditiis laboriosam quas rerum
                  odio maxime explicabo voluptatibus dolores molestiae
                  repellendus nobis aspernatur aut sequi numquam porro impedit!
                  Error, possimus. Aliquam, blanditiis? Expedita id atque
                  dolores, eos sunt nisi ex ipsam perspiciatis provident, quod
                  aspernatur sint reprehenderit aperiam impedit laborum.
                  Aspernatur voluptatem ad ab saepe ex delectus sunt illo
                  accusamus. Nam esse earum hic veniam dignissimos sapiente
                  maiores temporibus voluptates perspiciatis ratione. Omnis
                  sapiente libero earum quam! Facere distinctio sunt architecto
                  fugit quam! Architecto, consequuntur? Minus, amet quam? Nihil,
                  tempora? Excepturi quos odio quisquam ipsam fuga obcaecati
                  sequi recusandae molestias non qui velit eos maiores amet
                  aliquid, hic voluptatibus odit eum iste culpa tempore?
                  Voluptatum, rem! Modi soluta minus corporis. Nobis quis fugiat
                  delectus error quia animi maiores corporis sed velit impedit
                  ut illo voluptas voluptates reprehenderit tempora suscipit
                  optio sequi necessitatibus, quisquam in pariatur natus!
                  Quibusdam nulla iure omnis! Id voluptatibus soluta consectetur
                  ea odit minus rerum quae eum consequuntur, odio suscipit
                  temporibus neque reprehenderit unde perferendis corporis
                  delectus pariatur fugit nulla vero harum praesentium quidem.
                  Corporis, distinctio officiis. Aspernatur sunt nostrum dolore!
                  Vitae ab iure quas ex deleniti similique officiis at deserunt
                  odit voluptatem saepe dolor nihil in nesciunt et, eaque
                  perferendis quo dolorem reiciendis cum maiores voluptatibus.
                  Molestiae eaque assumenda voluptates similique ipsum at
                  corporis earum magnam. Beatae officia cumque, quo fuga hic
                  omnis doloremque voluptatem, alias error, eius molestias
                  perferendis incidunt velit. Quod harum iusto dolorem?
                  Reiciendis, repudiandae? Voluptatum reprehenderit perferendis
                  accusamus earum vero laborum assumenda, id magnam hic,
                  necessitatibus dolorum eligendi ex cum, quam voluptatem quae.
                  Nostrum quisquam quae sapiente amet adipisci fugiat voluptates
                  accusamus. Officia dicta ipsum ut porro eveniet rerum
                  doloribus quidem, veniam voluptas sit ipsa mollitia architecto
                  qui accusantium molestiae a ea tempora eos magnam inventore
                  nisi. Provident exercitationem assumenda incidunt cumque!
                  Magni aliquid nemo nostrum voluptatem, porro aliquam. Nam
                  suscipit nisi similique. Ea ut neque animi reprehenderit,
                  asperiores esse commodi quod tenetur perferendis numquam
                  doloremque quos! Quod beatae quas incidunt architecto. Magni
                  deserunt esse quisquam impedit itaque excepturi distinctio
                  quam alias? Veritatis, soluta error. Amet quibusdam aliquid
                  magni, iure sapiente laborum odio quis id culpa neque cumque
                  natus saepe quae ullam. Ducimus aliquam, nisi harum at
                  laboriosam quidem iste reiciendis nulla consequatur et quia
                  possimus id saepe sit, nam nemo facere est voluptates minima
                  eaque eum? Assumenda voluptatum ipsa facere suscipit. Quidem
                  magnam vero eos sunt corrupti. Illo nobis debitis provident
                  doloremque repudiandae et, soluta enim nemo. Ex voluptatem
                  neque libero eaque repellat molestias, consectetur facilis
                  porro, architecto ad, eum repellendus! Rem magnam, nulla, est
                  esse laudantium alias reprehenderit consequuntur, minima
                  architecto expedita modi eligendi culpa odit obcaecati.
                  Deleniti maiores accusantium hic, fugiat minima nulla quidem
                  sunt fugit, beatae dolorum quod? Aliquid excepturi, quos
                  commodi amet odit enim aperiam harum praesentium fugit ullam
                  provident adipisci nihil perspiciatis eos vel hic, nostrum a
                  neque? Voluptas asperiores quod ipsum dicta veritatis ipsa!
                  Debitis! Consequuntur distinctio, sequi voluptatibus at iusto
                  adipisci exercitationem! Temporibus ex iusto cum facere nam
                  dolore eveniet esse nostrum labore accusamus. Asperiores minus
                  error fuga iure saepe quibusdam voluptas, provident quod?
                  Aliquam in provident quod tempora architecto consectetur
                  deserunt debitis dolor, at tempore aut officiis nulla id
                  assumenda adipisci! Ullam ipsa ducimus accusantium illum
                  repellat quisquam consequatur voluptate necessitatibus, fugit
                  explicabo. Delectus eaque minima dolores, repudiandae fuga hic
                  natus commodi cupiditate sequi, temporibus distinctio
                  doloribus unde perspiciatis? Tempora autem soluta pariatur ab
                  minima dignissimos velit totam beatae ipsum. Blanditiis,
                  reprehenderit repellat. Dolorem, id animi consequatur fuga sit
                  labore sunt distinctio laboriosam velit illum praesentium
                  optio quo sequi esse laborum ipsa ut a dolores molestias iusto
                  at ipsum accusantium. Dolorum, optio tempore? Perferendis
                  asperiores esse a nemo incidunt alias voluptas ipsam ex
                  consectetur expedita ut aliquam, porro reprehenderit molestiae
                  eos voluptates tenetur dicta nihil vero nisi earum rem
                  mollitia, quia illum. Accusantium. Repellendus ea, impedit
                  saepe expedita tempore quo, fugiat excepturi dolorem
                  repudiandae atque similique temporibus! Dolorum dicta maiores
                  magnam, optio natus reiciendis, sunt fuga nam ipsum atque non
                  aperiam assumenda saepe? Corrupti quisquam, perspiciatis, quia
                  facere, nulla totam ea inventore aliquid officia amet
                  veritatis modi eius soluta ratione explicabo tenetur nostrum
                  sint cupiditate eos beatae numquam voluptatem. Molestiae
                  voluptates neque doloremque? Odit officiis vel eum quidem
                  fugit voluptatibus a, soluta rerum iste corporis accusantium
                  alias magni atque illo earum non voluptate mollitia sapiente
                  praesentium eius veritatis maiores nihil. Suscipit, placeat
                  mollitia. Itaque quod doloremque soluta magni enim similique
                  blanditiis officia qui nostrum nihil cupiditate consequuntur
                  numquam ducimus consequatur fuga, dolores sint, quibusdam id
                  quasi architecto ad. Ducimus id tenetur deleniti labore?
                  Veniam unde error ad corporis. Sed fugiat, est aspernatur sit
                  aperiam minus vel corporis eligendi, quia blanditiis inventore
                  facere illo, incidunt a ab maxime enim quod! Reprehenderit
                  magnam maxime vitae! Quasi quibusdam earum ipsa, laboriosam
                  hic necessitatibus sunt accusantium iste excepturi sequi
                  libero pariatur reiciendis porro autem culpa rem laborum cum
                  aut debitis accusamus? Voluptatibus consectetur impedit ab
                  laudantium earum. Atque sit ab laborum voluptatibus, quae
                  aperiam vel exercitationem iste facere reiciendis
                  necessitatibus error excepturi enim adipisci? Labore accusamus
                  dolore nam quo, quam ipsum aliquam animi voluptas ullam,
                  blanditiis ipsam? Praesentium quos saepe veniam voluptas atque
                  laborum perferendis repudiandae accusantium, repellendus,
                  corporis neque pariatur sapiente unde voluptate, quisquam
                  rerum voluptatem dignissimos? Exercitationem, repudiandae enim
                  eaque tenetur alias impedit pariatur a? Repudiandae expedita
                  quae error, aliquam ratione quaerat perspiciatis qui,
                  laudantium soluta dignissimos voluptate. Saepe id assumenda ab
                  atque ullam corrupti deserunt beatae nesciunt velit aspernatur
                  vero, architecto vitae facilis! Natus. Non animi aliquam,
                  vitae dolor quia architecto quos consectetur pariatur modi
                  debitis nostrum dolores natus officiis velit quam voluptates,
                  eius ut ullam deserunt. Atque voluptatem doloremque quisquam,
                  iure commodi ad. Dicta voluptatem assumenda quam pariatur aut!
                  Ex iste laborum illum vitae debitis possimus quibusdam itaque,
                  quod unde repellendus, corporis deserunt explicabo officia
                  vero doloribus. Doloremque adipisci obcaecati voluptas vitae
                  harum. Sunt consequatur, asperiores cumque maxime molestiae
                  ullam ipsum incidunt nihil eius pariatur harum eos! Sunt,
                  minima repudiandae nostrum blanditiis cumque rerum, vitae
                  neque debitis recusandae modi optio. Totam, nam ipsum. Iste,
                  consectetur. Accusantium fugit aperiam nobis sint voluptates
                  assumenda, corrupti, velit omnis labore fuga quis, amet magnam
                  ad quam magni? Voluptates deserunt quasi debitis maiores sed
                  aspernatur ipsum optio fugit. At, odit illum incidunt
                  distinctio debitis voluptatibus voluptatem facilis neque
                  provident facere possimus numquam quas culpa. Officiis,
                  commodi. Tenetur quo porro mollitia recusandae modi iste
                  accusantium accusamus culpa dolorem reiciendis! Molestiae
                  dolorum earum adipisci aspernatur officia suscipit impedit?
                  Alias nobis unde nemo aliquam repellat, dicta commodi
                  exercitationem officia, quis laudantium magni illum atque
                  libero. Id a nihil fuga possimus blanditiis. Quasi pariatur
                  cupiditate qui, consequuntur molestias assumenda. Quis
                  eligendi tenetur labore quisquam. Quidem, aspernatur, officiis
                  harum aperiam dolore dolorum consectetur, deleniti non sequi
                  doloremque eius quas! Ratione fugiat maxime voluptatibus?
                  Accusantium quia impedit doloribus laudantium architecto
                  eligendi molestias, minus vitae nobis iste deserunt
                  repellendus harum velit blanditiis explicabo quasi quidem!
                  Sapiente minima repellendus labore. Maxime eos neque ut
                  quibusdam illo. Minus earum nulla alias quis dolore deleniti,
                  excepturi molestias quibusdam dolor vel consequatur sint
                  cupiditate ea exercitationem officiis dolorem repellendus, sit
                  asperiores, pariatur sapiente dignissimos non aperiam nam
                  eaque. Minima! Officia doloremque ab reiciendis reprehenderit
                  excepturi sunt atque, ipsam error nobis rem explicabo
                  quibusdam iste fuga repellat quae totam unde nihil, vero sit
                  consequuntur exercitationem suscipit culpa magnam
                  perspiciatis. At? Porro aspernatur numquam dicta adipisci
                  earum perspiciatis officia illo saepe corrupti molestiae,
                  commodi expedita? Quas, tempora! Alias et beatae laborum iure,
                  eaque esse eos cumque fugiat optio quae doloremque adipisci.
                  Porro aut facere pariatur asperiores ab beatae commodi cumque
                  sed dignissimos, dolores laborum saepe, nulla sunt corrupti
                  eos voluptate adipisci quibusdam deserunt. Itaque deserunt
                  pariatur voluptatum recusandae quis officia sit! Totam vero
                  voluptatem ipsum harum quasi illo exercitationem. Inventore,
                  quos? Maiores nostrum doloremque nemo! Ducimus beatae
                  excepturi cumque illo harum illum quidem consequatur
                  repellendus, esse dolorum tenetur fugiat inventore ipsa?
                  Consequuntur quas vel necessitatibus culpa dicta harum porro
                  iste nam voluptates perspiciatis perferendis cumque accusamus
                  fuga repellendus adipisci dignissimos commodi omnis asperiores
                  nulla odio iure, sequi cupiditate suscipit error. Rerum. Culpa
                  iste at sit maxime et quas ipsam debitis alias quae.
                  Reprehenderit culpa odit molestias repudiandae iusto, quia,
                  placeat provident cum cumque eligendi excepturi magnam
                  officiis a, quos id enim! Fugit vel totam harum nam earum
                  nesciunt asperiores maiores magnam sit cumque pariatur,
                  molestiae, maxime, ipsam at quaerat. Nihil eaque perspiciatis
                  dolore aspernatur, inventore quo sit praesentium ducimus
                  sapiente ipsum. Temporibus quibusdam ut autem facere est quis
                  commodi molestiae explicabo voluptatum voluptate quisquam
                  pariatur exercitationem voluptas culpa ducimus ullam nesciunt
                  blanditiis, dolorem facilis dignissimos totam suscipit enim
                  alias doloribus. Ratione? Inventore repudiandae excepturi
                  dolore libero illo itaque perspiciatis animi similique
                  explicabo sapiente et sint vitae hic ratione perferendis
                  quibusdam, impedit architecto eveniet dignissimos cum ut
                  adipisci? Id quis earum sequi. Blanditiis dolore sequi ea ab,
                  similique pariatur nemo necessitatibus voluptates consequatur
                  molestiae? Hic deleniti, doloremque atque libero alias in ea
                  dignissimos necessitatibus aspernatur, est illo? Tempora,
                  impedit dolorum? Facere, aut. Odio perspiciatis minima
                  repudiandae repellendus! Impedit minus delectus repellendus,
                  soluta sed laudantium numquam voluptatibus distinctio adipisci
                  enim, vero consectetur inventore aut praesentium cum quidem
                  esse sequi, quod velit odit nemo. Odit veniam ad ab cum modi
                  debitis rem similique ipsum voluptate fugit magnam deleniti
                  reiciendis neque reprehenderit voluptates earum distinctio
                  sint enim laboriosam vero, sunt quis optio omnis libero? Sed?
                  Deserunt ipsam nemo cumque quia fugit dolor atque facilis
                  suscipit deleniti neque architecto sit iusto, voluptatem
                  accusamus similique quo nam. Fugiat reiciendis iure eum a
                  porro blanditiis quibusdam molestias quia. Eveniet nostrum
                  eius assumenda provident excepturi quam dolor iste rerum
                  nesciunt quibusdam, a molestiae corporis nulla quisquam modi,
                  reprehenderit dolore officia cupiditate. Molestiae quisquam
                  necessitatibus corrupti obcaecati numquam adipisci unde.
                  Veniam veritatis dolorum debitis architecto consequatur ut
                  incidunt expedita aliquid nostrum quisquam. Enim fugit veniam
                  ea maxime mollitia ipsam ad velit accusamus culpa, aperiam
                  alias reprehenderit, provident autem fugiat cupiditate?
                  Laborum suscipit fugit repudiandae assumenda facere deserunt
                  nesciunt animi nobis delectus sint sequi fugiat impedit,
                  aspernatur ducimus, molestiae accusamus minima quaerat ipsa!
                  Ipsum distinctio molestias similique, perspiciatis enim
                  doloribus beatae. Placeat vero porro mollitia saepe quis
                  quibusdam magni incidunt reiciendis accusamus necessitatibus.
                  Commodi eligendi eum, quae molestiae illum nesciunt, inventore
                  magni quaerat voluptates necessitatibus non, fuga porro
                  voluptatum ea mollitia. Libero, animi eum quibusdam iste sint,
                  deserunt eaque nobis adipisci expedita minima laboriosam quia
                  corrupti ea. Odio numquam voluptatem, blanditiis nobis labore
                  eum eligendi ipsam explicabo. Voluptatem, cupiditate aliquam!
                  Debitis!
                </p>
          </HydrationBoundary>
        </section>
      </div>
    </main>
  );

}