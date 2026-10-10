import { createClient } from '@supabase/supabase-js';
import { tourismData as localTourismData } from '../data/tourismdata';

// Supabase credentials (Jab aap apna Supabase project bana loge, tab yahan URL aur Key daal denge)
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'YOUR_SUPABASE_URL_HERE';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY_HERE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Ye function check karega: Cloud se data laao, 
 * agar internet ya server mein kuch gadbad ho toh local file wala data de do!
 */
export async function fetchTourismData() {
  try {
    const { data, error } = await supabase
      .from('destinations')
      .select('*');

    if (error || !data || data.length === 0) {
      console.warn("Cloud data not found or offline. Falling back to local data.");
      return localTourismData;
    }

    // Cloud data ko wahi purane object format mein convert karna jaisa app chahti hai
    const formattedData: Record<string, any> = {};
    data.forEach((item) => {
      formattedData[item.id] = {
        Name: item.name,
        City: item.city,
        State: item.state,
        Type: item.type,
        image_url: item.image_url,
        weather: item.weather,
        bestTime: item.best_time,
        packing: item.packing,
        budget: item.budget,
        history_geo_political: item.history_geo_political,
        picnic_spots: item.picnic_spots,
        transport_roadmap: item.transport_roadmap,
        hotels_booking: item.hotels_booking,
        markets_food: item.markets_food,
        culture_helpline: item.culture_helpline,
      };
    });

    return formattedData;
  } catch (err) {
    console.error("Error fetching from Supabase, using local backup:", err);
    return localTourismData;
  }
}
