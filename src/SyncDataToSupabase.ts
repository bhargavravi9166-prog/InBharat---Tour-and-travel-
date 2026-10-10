import { createClient } from '@supabase/supabase-js'
import { tourismData } from './tourismdata'

const supabaseUrl = 'https://mdwcvukhlpvjwxmskidg.supabase.co'
const supabaseKey = 'ANON_KEY_YAHAN_DALNA' // apni anon key yahan daal dena
const supabase = createClient(supabaseUrl, supabaseKey)

export async function syncTourismData() {
  for (const [key, item] of Object.entries(tourismData)) {
    const { data: existing } = await supabase
      .from('destinations')
      .select('id')
      .eq('name', item.Name)
      .single()

    if (existing) continue

    await supabase
      .from('destinations')
      .insert({
        name: item.Name,
        state: item.State,
        description: `${item.history_geo_political}\n\nWeather: ${item.weather}\nBest Time: ${item.bestTime}\nBudget: ${item.budget}\nHighlights:\n${item.picnic_spots}`,
        image_url: item.image_url
      })
  }
}
