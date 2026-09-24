export type Num = number | null | undefined

export interface Review {
  rating?: number | null
  text?: string | null
  time?: string | null
  relative?: string | null
  author?: string | null
}

export interface Theme { pos?: number; neg?: number }
export type Themes = Record<string, Theme>

export interface Activity {
  by_weekday?: number[]
  by_hour?: number[]
  by_month?: Record<string, number>
}

export interface Place {
  id: string
  name: string
  district: string
  address?: string | null
  lat?: number | null
  lng?: number | null
  rating?: number | null
  reviews_count?: number | null
  is_24h?: boolean | null
  is_24h_google?: boolean | null
  emergency?: boolean | null
  hours?: string[] | null
  website?: string | null
  phone?: string | null
  maps_url?: string | null
  reviews?: Review[] | null
  is_clinic?: boolean | null
  instagram?: string | null
  instagram_followers?: number | null
  facebook?: string | null
  tiktok?: string | null
  social_reputation?: string | null
  services?: string[] | null
  specialties?: string[] | null
  consult_price?: number | null
  price_notes?: string | null
  ticket?: number | null
  ticket_basis?: string | null
  segment?: string | null
  chain?: string | null
  founded_year?: number | null
  notes?: string | null
  themes?: Themes | null
  sources?: string[] | null
}

export interface Cell {
  lat: number
  lng: number
  clinics_1km?: number | null
  pois_500m?: number | null
  nearest_24h_km?: number | null
  nearest_clinic_km?: number | null
  households_est?: number | null
  score?: number | null
  district?: string
}

export interface Regulation {
  license_cost_soles?: number | null
  license_cost_high_risk_soles?: number | null
  license_days?: number | null
  zoning_allowed?: string[] | null
  zoning_allowed_consultorio?: string[] | null
  cap_exists?: boolean | 'unknown' | null
  cap_note?: string | null
  pet_registry?: boolean | null
  dog_parks?: number | null
  friction?: 'Baja' | 'Media' | 'Alta' | string | null
  sources?: string[] | null
}

export interface TopEntry { name: string; rating?: number | null; reviews?: number | null; share_pct?: number | null; is_24h?: boolean; ticket?: number | null }

export interface District {
  district: string
  count: number
  count_24h?: number | null
  pct_24h?: number | null
  avg_rating?: number | null
  median_reviews?: number | null
  total_reviews?: number | null
  rating_dist?: Record<string, number>
  low_rated?: number | null
  avg_ticket?: number | null
  ticket_n?: number | null
  chains?: [string, number][]
  top?: TopEntry[]
  themes?: Themes
  coverage?: number[][] | null
  activity?: Activity
  population?: number | null
  households?: number | null
  nse_ab_pct?: number | null
  rent_usd_m2?: number | null
  avg_income?: number | null
  clinics_per_10k?: number | null
  households_per_clinic?: number | null
  regulation?: Regulation | null
  stats_sources?: Record<string, string>
  stats_estimated?: Record<string, boolean>
  area_km2?: number | null
  best_cells?: Cell[]
  avg_competitors_1km?: number | null
  median_nearest_24h_km?: number | null
  score_components?: Record<string, number>
  score: number
  score_label?: string
}

export interface Poi { kind: 'park' | 'dog_park' | 'pet_shop' | 'supermarket' | string; name?: string | null; lat: number; lng: number }

export interface BreakevenAssumptions {
  capex_usd_100m2?: number
  capex_scale_with_m2?: boolean
  local_m2?: number
  staff?: { vets?: number; vet_gross_soles?: number; assistants?: number; assistant_gross_soles?: number; labor_overhead_pct?: number; note?: string }
  staff_monthly_soles?: number
  supplies_pct?: number
  other_fixed_monthly_soles?: number
  other_fixed_is_estimate?: boolean
  ticket_default_soles?: number
  ticket_includes_igv?: boolean
  igv_pct?: number
  margin_target_pct?: number
  usd_pen?: number
  working_days_month?: number
  visits_per_vet_day_capacity?: number
  fair_share?: { pet_households_pct?: number; vet_visit_rate?: number; visits_per_household_year?: number; open_days_year?: number }
  sources?: { field: string; url: string; note?: string }[]
}

export interface Global {
  raw_places?: number
  excluded_neighbors?: number
  excluded_not_clinic?: number
  search_cap_note?: string
  count?: number
  count_24h?: number
  avg_rating?: number
  total_reviews?: number
  avg_ticket?: number
  themes?: Themes
  coverage?: number[][]
  activity?: Activity
  enriched?: number
}

export interface GeoFeature { type: 'Feature'; properties: { district?: string }; geometry: { type: 'Polygon' | 'MultiPolygon'; coordinates: number[][][] | number[][][][] } }

export interface Dash {
  generated_at?: string
  weights?: Record<string, number>
  districts?: District[]
  ranking?: string[]
  global?: Global
  places?: Place[]
  grid?: Record<string, Cell[]>
  breakeven?: { breakeven_assumptions?: BreakevenAssumptions }
  districts_geojson?: { type: string; features: GeoFeature[] }
  pois?: Poi[]
}
