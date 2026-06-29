import { NextResponse } from 'next/server';

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface PlaceDetailsGeocoding {
  formatted_address?: string;
  geometry?: {
    location?: {
      lat: number;
      lng: number;
    };
  };
  address_components?: AddressComponent[];
}

function extractComponent(
  components: AddressComponent[],
  type: string
): string {
  return components.find((c) => c.types.includes(type))?.long_name || '';
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const placeId = searchParams.get('place_id');

  if (!placeId) {
    return NextResponse.json(
      { error: 'place_id is required' },
      { status: 400 }
    );
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Google Places API key is not configured' },
      { status: 500 }
    );
  }

  try {
    const fields = ['formatted_address', 'geometry', 'address_components'].join(
      ','
    );

    const url = new URL(
      'https://maps.googleapis.com/maps/api/place/details/json'
    );

    url.searchParams.set('place_id', placeId);
    url.searchParams.set('fields', fields);
    url.searchParams.set('key', apiKey);

    const response = await fetch(url.toString());

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch place details' },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data.status !== 'OK') {
      return NextResponse.json(
        { error: data.error_message || data.status },
        { status: 400 }
      );
    }

    const result: PlaceDetailsGeocoding = data.result;

    const components = result.address_components || [];

    return NextResponse.json({
      place_id: placeId,
      formatted_address: result.formatted_address || '',
      latitude: result.geometry?.location?.lat ?? null,
      longitude: result.geometry?.location?.lng ?? null,
      state: extractComponent(components, 'administrative_area_level_1'),
      country: extractComponent(components, 'country'),
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch place details' },
      { status: 500 }
    );
  }
}
