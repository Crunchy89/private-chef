import { CmsImage } from "@/components/CmsImage";
import { Reveal } from "@/components/Reveal";
import { SplitHeading } from "@/components/SplitHeading";
import { getSiteCms } from "@/lib/site-cms";

function paragraphs(body: string) {
  return body
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export async function Chef() {
  const content = await getSiteCms();
  const body = paragraphs(content.content.chefBody);

  return (
    <section id="chef" className="section-pad-y bg-surface-gray">
      <div className="mx-auto grid max-w-6xl items-center lg:grid-cols-2">
        <Reveal
          variant="left"
          className="order-2 flex flex-col justify-center px-4 text-center sm:px-10 lg:order-1 lg:px-16 lg:text-left"
        >
          <SplitHeading
            lead={content.content.chefTitleLead}
            rest={content.content.chefTitleRest}
            className="text-2xl leading-snug sm:text-3xl md:text-4xl lg:text-5xl"
          />
          {body.map((para, index) => (
            <p
              key={index}
              className={`text-sm leading-relaxed text-ink sm:text-base md:text-lg ${
                index === 0 ? "mt-4 sm:mt-5" : "mt-3 sm:mt-4"
              }`}
            >
              {para}
            </p>
          ))}
        </Reveal>

        <Reveal
          variant="right"
          delay={1}
          className="relative order-1 flex min-h-[320px] w-full items-center justify-center sm:min-h-[420px] lg:order-2 lg:min-h-[560px]"
        >
          <CmsImage
            src={content.chefImage}
            alt="Private chef preparing a plated dish for villa dining in Lombok"
            fill
            className="object-contain object-center p-4 sm:p-6"
          />
        </Reveal>
      </div>
    </section>
  );
}
