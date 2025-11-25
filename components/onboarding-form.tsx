"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Info } from "lucide-react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Spinner } from "@/components/ui/spinner"

const formSchema = z.object({
  vade: z.string().min(1, "Lütfen yatırım sürenizi seçin"),
  urun: z.string().min(1, "Lütfen yatırım ürününüzü seçin"),
  nitelikli: z.string().min(1, "Lütfen varlık durumunuzu belirtin"),
  nakit: z.string().min(1, "Lütfen likidite ihtiyacınızı seçin"),
  karakter: z.string().min(1, "Lütfen risk karakterinizi seçin"),
  ilgi: z.string().min(1, "Lütfen ilgi alanınızı belirtin"),
})

type FormData = z.infer<typeof formSchema>

interface OnboardingFormProps {
  onSubmit: (data: FormData) => void
  isProcessing: boolean
}

export function OnboardingForm({ onSubmit, isProcessing }: OnboardingFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vade: "",
      urun: "",
      nitelikli: "",
      nakit: "",
      karakter: "",
      ilgi: "",
    },
  })

  return (
    <TooltipProvider>
      <div className="w-full max-w-2xl space-y-6 rounded-lg border border-border bg-card p-6 shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Question 1: Vade */}
            <FormField
              control={form.control}
              name="vade"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                      1. Ne kadar süre yatırım yapmayı planlıyorsun?
                    </h4>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="inline-flex items-center justify-center h-6 w-6 shrink-0 cursor-help">
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>
                          Yatırım süreniz, paranızı ne kadar süre bekletebileceğinizi gösterir.
                          Daha uzun süreler genellikle daha yüksek getiri potansiyeli sunar.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Yatırım süreniz risk profilinizi belirler
                  </p>
                  <FormControl>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-2">
                      <Button
                        type="button"
                        variant={field.value === "1 yıldan az" ? "default" : "outline"}
                        onClick={() => field.onChange("1 yıldan az")}
                      >
                        1 yıldan az
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "1-3 yıl" ? "default" : "outline"}
                        onClick={() => field.onChange("1-3 yıl")}
                      >
                        1-3 yıl
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "3-5 yıl" ? "default" : "outline"}
                        onClick={() => field.onChange("3-5 yıl")}
                      >
                        3-5 yıl
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "5 yıl+" ? "default" : "outline"}
                        onClick={() => field.onChange("5 yıl+")}
                      >
                        5 yıl+
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Question 2: Ürün */}
            <FormField
              control={form.control}
              name="urun"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                      2. Hangi yatırım ürünleri ilgini çeker?
                    </h4>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="inline-flex items-center justify-center h-6 w-6 shrink-0 cursor-help">
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>
                          Farklı yatırım ürünleri farklı risk ve getiri profilleri sunar.
                          Tercihleriniz size uygun fonları belirlememize yardımcı olacak.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Yatırım tercihinizi belirtin
                  </p>
                  <FormControl>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-2">
                      <Button
                        type="button"
                        variant={field.value === "Yatırım Fonu" ? "default" : "outline"}
                        onClick={() => field.onChange("Yatırım Fonu")}
                      >
                        Yatırım Fonu
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "Altın" ? "default" : "outline"}
                        onClick={() => field.onChange("Altın")}
                      >
                        Altın
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "Mevduat" ? "default" : "outline"}
                        onClick={() => field.onChange("Mevduat")}
                      >
                        Mevduat
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "Döviz" ? "default" : "outline"}
                        onClick={() => field.onChange("Döviz")}
                      >
                        Döviz
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "Hisse Senedi" ? "default" : "outline"}
                        onClick={() => field.onChange("Hisse Senedi")}
                      >
                        Hisse Senedi
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "Karma" ? "default" : "outline"}
                        onClick={() => field.onChange("Karma")}
                      >
                        Karma
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Question 3: Nitelikli */}
            <FormField
              control={form.control}
              name="nitelikli"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                      3. Toplam varlığın 1 milyon TL&apos;nin üzerinde mi?
                    </h4>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="inline-flex items-center justify-center h-6 w-6 shrink-0 cursor-help">
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>
                          <strong>Nitelikli yatırımcı:</strong> Finansal bilgiye, deneyime sahip
                          ve yatırım risklerini anlayabilen yatırımcılardır. SPK düzenlemelerine
                          göre belirli kriterleri karşılayanlar bu statüye sahip olabilir.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Nitelikli yatırımcı statünüzü belirtin
                  </p>
                  <FormControl>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-2">
                      <Button
                        type="button"
                        variant={field.value === "Evet" ? "default" : "outline"}
                        onClick={() => field.onChange("Evet")}
                      >
                        Evet
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "Hayır" ? "default" : "outline"}
                        onClick={() => field.onChange("Hayır")}
                      >
                        Hayır
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "Emin değilim" ? "default" : "outline"}
                        onClick={() => field.onChange("Emin değilim")}
                      >
                        Emin değilim
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Question 4: Likidite/Nakit */}
            <FormField
              control={form.control}
              name="nakit"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                      4. Paraya acil ihtiyacın olursa ne sıklıkta nakde dönmek istersin?
                    </h4>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="inline-flex items-center justify-center h-6 w-6 shrink-0 cursor-help">
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>
                          <strong>Likidite:</strong> Yatırımınızı nakde dönüştürme kolaylığı.
                          Yüksek likidite ihtiyacı olanlar daha likit ürünlere yönlendirilir.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Likidite ihtiyacınız risk toleransınızı etkiler
                  </p>
                  <FormControl>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-2">
                      <Button
                        type="button"
                        variant={field.value === "Çok düşük" ? "default" : "outline"}
                        onClick={() => field.onChange("Çok düşük")}
                      >
                        Çok düşük
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "Düşük" ? "default" : "outline"}
                        onClick={() => field.onChange("Düşük")}
                      >
                        Düşük
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "Orta" ? "default" : "outline"}
                        onClick={() => field.onChange("Orta")}
                      >
                        Orta
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "Yüksek" ? "default" : "outline"}
                        onClick={() => field.onChange("Yüksek")}
                      >
                        Yüksek
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Question 5: Karakter */}
            <FormField
              control={form.control}
              name="karakter"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                      5. Piyasalar düştüğünde ilk tepkin ne olur?
                    </h4>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="inline-flex items-center justify-center h-6 w-6 shrink-0 cursor-help">
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>
                          Risk karakteriniz, piyasa dalgalanmalarına tepkinizi gösterir.
                          Bu, size uygun risk seviyesini belirlememize yardımcı olur.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Risk toleransınızı değerlendiriyoruz
                  </p>
                  <FormControl>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-2">
                      <Button
                        type="button"
                        variant={field.value === "Hemen satarım" ? "default" : "outline"}
                        onClick={() => field.onChange("Hemen satarım")}
                      >
                        Hemen satarım
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "Bekler izlerim" ? "default" : "outline"}
                        onClick={() => field.onChange("Bekler izlerim")}
                      >
                        Bekler izlerim
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "Fırsat görürüm" ? "default" : "outline"}
                        onClick={() => field.onChange("Fırsat görürüm")}
                      >
                        Fırsat görürüm
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "Deneyimsizim" ? "default" : "outline"}
                        onClick={() => field.onChange("Deneyimsizim")}
                      >
                        Deneyimsizim
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Question 6: İlgi Alanları */}
            <FormField
              control={form.control}
              name="ilgi"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                      6. Teknoloji veya çevre dostu yatırımlar ilgini çeker mi?
                    </h4>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="inline-flex items-center justify-center h-6 w-6 shrink-0 cursor-help">
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>
                          İlgi alanlarınıza göre sürdürülebilirlik veya teknoloji odaklı
                          fonlar önerebiliriz.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Tematik yatırım tercihinizi belirtin
                  </p>
                  <FormControl>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-2">
                      <Button
                        type="button"
                        variant={field.value === "Evet ilgimi çeker" ? "default" : "outline"}
                        onClick={() => field.onChange("Evet ilgimi çeker")}
                      >
                        Evet ilgimi çeker
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "Biraz" ? "default" : "outline"}
                        onClick={() => field.onChange("Biraz")}
                      >
                        Biraz
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "Hayır" ? "default" : "outline"}
                        onClick={() => field.onChange("Hayır")}
                      >
                        Hayır
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-[#3a6ea5] hover:bg-[#004e98] text-[#CFD2CD] transition-colors"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Spinner className="mr-2" />
                  Değerlendiriliyor...
                </>
              ) : (
                "Gönder"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </TooltipProvider>
  )
}
