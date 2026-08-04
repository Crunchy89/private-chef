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

export async function About() {
  const content = await getSiteCms();
  const body = paragraphs(content.content.aboutBody);

  return (
    <section id="about" className="section-pad-y bg-surface-white">
      <div className="mx-auto grid max-w-6xl items-center lg:grid-cols-2">
        <Reveal
          variant="left"
          className="relative flex min-h-[320px] w-full items-center justify-center sm:min-h-[420px] lg:min-h-[560px]"
        >
          <CmsImage
            src={content.aboutImage}
            alt="Guests enjoying a private chef dinner in a Lombok villa"
            fill
            priority
            className="object-contain object-center p-4 sm:p-6"
          />
        </Reveal>

        <Reveal
          variant="right"
          delay={1}
          className="flex flex-col justify-center px-4 text-center sm:px-10 lg:px-16 lg:text-left"
        >
          <SplitHeading
            lead={content.content.aboutTitleLead}
            rest={content.content.aboutTitleRest}
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
      </div>
    </section>
  );
}
