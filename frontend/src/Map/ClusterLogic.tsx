// frontend/components/Map/ClusterLogic.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapboxGL from '@rnmapbox/maps';

interface Props {
  items: { id: number; latitude: number; longitude: number; title: string }[];
}

export default function ClusterLogic({ items }: Props) {
  const features = items.map((item) => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [item.longitude, item.latitude],
    },
    properties: {
      id: item.id,
      title: item.title,
    },
  }));

  const geoJson = {
    type: 'FeatureCollection',
    features,
  };

  return (
    <MapboxGL.ShapeSource
      id="cluster-source"
      shape={geoJson}
      cluster
      clusterRadius={40}
      clusterMaxZoom={14}
    >
      <MapboxGL.SymbolLayer
        id="point-symbol"
        style={{
          iconImage: 'marker-15',
          iconSize: 1.5,
        }}
        filter={['!', ['has', 'point_count']]}
      />

      <MapboxGL.CircleLayer
        id="clustered-points"
        belowLayerID="point-symbol"
        filter={['has', 'point_count']}
        style={{
          circleRadius: ['step', ['get', 'point_count'], 18, 10, 22, 25, 30],
          circleColor: ['step', ['get', 'point_count'], '#8ed1fc', 10, '#00aced', 25, '#007bb5'],
          circleOpacity: 0.8,
          circleStrokeWidth: 1,
          circleStrokeColor: '#fff',
        }}
      />

      <MapboxGL.SymbolLayer
        id="cluster-count"
        filter={['has', 'point_count']}
        style={{
          textField: '{point_count}',
          textSize: 14,
          textColor: '#fff',
          textIgnorePlacement: true,
          textAllowOverlap: true,
        }}
      />
    </MapboxGL.ShapeSource>
  );
}
