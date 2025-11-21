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
  vade: z.string({
    required_error: "Lütfen yatırım sürenizi seçin",
  }),
  urun: z.string({
    required_error: "Lütfen yatırım ürününüzü seçin",
  }),
  nitelikli: z.string({
    required_error: "Lütfen varlık durumunuzu belirtin",
  }),
  nakit: z.string({
    required_error: "Lütfen likidite ihtiyacınızı seçin",
  }),
  karakter: z.string({
    required_error: "Lütfen risk karakterinizi seçin",
  }),
  ilgi: z.string({
    required_error: "Lütfen ilgi alanınızı belirtin",
  }),
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
                        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                          <Info className="h-4 w-4" />
                        </Button>
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
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant={field.value === "1 yıldan az" ? "default" : "outline"}
                        onClick={() => field.onChange("1 yıldan az")}
                        className="flex-1 min-w-[140px]"
                      >
                        1 yıldan az
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "1-3 yıl" ? "default" : "outline"}
                        onClick={() => field.onChange("1-3 yıl")}
                        className="flex-1 min-w-[140px]"
                      >
                        1-3 yıl
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "3-5 yıl" ? "default" : "outline"}
                        onClick={() => field.onChange("3-5 yıl")}
                        className="flex-1 min-w-[140px]"
                      >
                        3-5 yıl
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "5 yıl+" ? "default" : "outline"}
                        onClick={() => field.onChange("5 yıl+")}
                        className="flex-1 min-w-[140px]"
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
                        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                          <Info className="h-4 w-4" />
                        </Button>
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
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant={field.value === "Yatırım Fonu" ? "default" : "outline"}
                        onClick={() => field.onChange("Yatırım Fonu")}
                        className="flex-1 min-w-[140px]"
                      >
                        Yatırım Fonu
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "Altın" ? "default" : "outline"}
                        onClick={() => field.onChange("Altın")}
                        className="flex-1 min-w-[140px]"
                      >
                        Altın
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "Mevduat" ? "default" : "outline"}
                        onClick={() => field.onChange("Mevduat")}
                        className="flex-1 min-w-[140px]"
                      >
                        Mevduat
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "Döviz" ? "default" : "outline"}
                        onClick={() => field.onChange("Döviz")}
                        className="flex-1 min-w-[140px]"
                      >
                        Döviz
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "Hisse Senedi" ? "default" : "outline"}
                        onClick={() => field.onChange("Hisse Senedi")}
                        className="flex-1 min-w-[140px]"
                      >
                        Hisse Senedi
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "Karma" ? "default" : "outline"}
                        onClick={() => field.onChange("Karma")}
                        className="flex-1 min-w-[140px]"
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
                      3. Toplam varlığın 1 milyon TL'nin üzerinde mi?
                    </h4>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                          <Info className="h-4 w-4" />
                        </Button>
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
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant={field.value === "Evet" ? "default" : "outline"}
                        onClick={() => field.onChange("Evet")}
                        className="flex-1 min-w-[140px]"
                      >
                        Evet
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "Hayır" ? "default" : "outline"}
                        onClick={() => field.onChange("Hayır")}
                        className="flex-1 min-w-[140px]"
                      >
                        Hayır
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "Emin değilim" ? "default" : "outline"}
                        onClick={() => field.onChange("Emin değilim")}
                        className="flex-1 min-w-[140px]"
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
                        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                          <Info className="h-4 w-4" />
                        </Button>
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
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant={field.value === "Çok düşük" ? "default" : "outline"}
                        onClick={() => field.onChange("Çok düşük")}
                        className="flex-1 min-w-[140px]"
                      >
                        Çok düşük
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "Düşük" ? "default" : "outline"}
                        onClick={() => field.onChange("Düşük")}
                        className="flex-1 min-w-[140px]"
                      >
                        Düşük
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "Orta" ? "default" : "outline"}
                        onClick={() => field.onChange("Orta")}
                        className="flex-1 min-w-[140px]"
                      >
                        Orta
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "Yüksek" ? "default" : "outline"}
                        onClick={() => field.onChange("Yüksek")}
                        className="flex-1 min-w-[140px]"
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
                        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                          <Info className="h-4 w-4" />
                        </Button>
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
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant={field.value === "Hemen satarım" ? "default" : "outline"}
                        onClick={() => field.onChange("Hemen satarım")}
                        className="flex-1 min-w-[140px]"
                      >
                        Hemen satarım
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "Bekler izlerim" ? "default" : "outline"}
                        onClick={() => field.onChange("Bekler izlerim")}
                        className="flex-1 min-w-[140px]"
                      >
                        Bekler izlerim
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "Fırsat görürüm" ? "default" : "outline"}
                        onClick={() => field.onChange("Fırsat görürüm")}
                        className="flex-1 min-w-[140px]"
                      >
                        Fırsat görürüm
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "Deneyimsizim" ? "default" : "outline"}
                        onClick={() => field.onChange("Deneyimsizim")}
                        className="flex-1 min-w-[140px]"
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
                        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                          <Info className="h-4 w-4" />
                        </Button>
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
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant={field.value === "Evet ilgimi çeker" ? "default" : "outline"}
                        onClick={() => field.onChange("Evet ilgimi çeker")}
                        className="flex-1 min-w-[140px]"
                      >
                        Evet ilgimi çeker
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "Biraz" ? "default" : "outline"}
                        onClick={() => field.onChange("Biraz")}
                        className="flex-1 min-w-[140px]"
                      >
                        Biraz
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "Hayır" ? "default" : "outline"}
                        onClick={() => field.onChange("Hayır")}
                        className="flex-1 min-w-[140px]"
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
              className="w-full bg-[#7d4e57] hover:bg-[#a6405d] text-[#CFD2CD] transition-colors"
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
