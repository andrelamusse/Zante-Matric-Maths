import type { GeometryReason } from '../types/curriculum.ts';

export const GEOMETRY_REASONS: GeometryReason[] = [
  // --- Lines & Angles ---
  {
    id: 'GEO-LA-01',
    category: 'lines_angles',
    fullTheorem: 'Adjacent angles on a straight line are supplementary',
    acceptableShortReason: 'adj ∠s on a str line',
    grade: 8,
  },
  {
    id: 'GEO-LA-02',
    category: 'lines_angles',
    fullTheorem: 'Vertically opposite angles are equal',
    acceptableShortReason: 'vert opp ∠s',
    grade: 8,
  },
  {
    id: 'GEO-LA-03',
    category: 'lines_angles',
    fullTheorem: 'Angles around a point add up to 360°',
    acceptableShortReason: '∠s round a pt',
    grade: 8,
  },
  {
    id: 'GEO-LA-04',
    category: 'lines_angles',
    fullTheorem: 'Alternate interior angles are equal (given parallel lines)',
    acceptableShortReason: 'alt ∠s; AB ∥ CD',
    grade: 8,
  },
  {
    id: 'GEO-LA-05',
    category: 'lines_angles',
    fullTheorem: 'Corresponding angles are equal (given parallel lines)',
    acceptableShortReason: 'corresp ∠s; AB ∥ CD',
    grade: 8,
  },
  {
    id: 'GEO-LA-06',
    category: 'lines_angles',
    fullTheorem: 'Co-interior angles are supplementary (given parallel lines)',
    acceptableShortReason: 'co-int ∠s; AB ∥ CD',
    grade: 8,
  },
  {
    id: 'GEO-LA-07',
    category: 'lines_angles',
    fullTheorem: 'Converse alternate angles equal proves lines are parallel',
    acceptableShortReason: 'alt ∠s =',
    grade: 8,
  },
  {
    id: 'GEO-LA-08',
    category: 'lines_angles',
    fullTheorem: 'Converse corresponding angles equal proves lines are parallel',
    acceptableShortReason: 'corresp ∠s =',
    grade: 8,
  },
  {
    id: 'GEO-LA-09',
    category: 'lines_angles',
    fullTheorem: 'Converse co-interior angles supplementary proves lines are parallel',
    acceptableShortReason: 'co-int ∠s supp',
    grade: 8,
  },

  // --- Triangles & Polygons ---
  {
    id: 'GEO-TR-01',
    category: 'triangles_polygons',
    fullTheorem: 'The sum of the interior angles of a triangle is 180°',
    acceptableShortReason: 'sum of ∠s in △',
    grade: 8,
  },
  {
    id: 'GEO-TR-02',
    category: 'triangles_polygons',
    fullTheorem: 'The exterior angle of a triangle equals the sum of the opposite interior angles',
    acceptableShortReason: 'ext ∠ of △',
    grade: 8,
  },
  {
    id: 'GEO-TR-03',
    category: 'triangles_polygons',
    fullTheorem: 'Angles opposite equal sides in an isosceles triangle are equal',
    acceptableShortReason: '∠s opp equal sides',
    grade: 8,
  },
  {
    id: 'GEO-TR-04',
    category: 'triangles_polygons',
    fullTheorem: 'Sides opposite equal angles in a triangle are equal',
    acceptableShortReason: 'sides opp equal ∠s',
    grade: 8,
  },
  {
    id: 'GEO-TR-05',
    category: 'triangles_polygons',
    fullTheorem: 'All angles in an equilateral triangle are equal to 60°',
    acceptableShortReason: 'equilateral △',
    grade: 8,
  },
  {
    id: 'GEO-TR-06',
    category: 'triangles_polygons',
    fullTheorem: 'In a right-angled triangle, hypotenuse squared equals the sum of squares of other two sides',
    acceptableShortReason: 'Pythagoras',
    grade: 8,
  },
  {
    id: 'GEO-TR-07',
    category: 'triangles_polygons',
    fullTheorem: 'If the square of one side equals the sum of squares of other two sides, opposite angle is 90°',
    acceptableShortReason: 'Converse Pythagoras',
    grade: 8,
  },
  {
    id: 'GEO-TR-08',
    category: 'triangles_polygons',
    fullTheorem: 'Triangles are congruent (SSS, SAS, AAS, or RHS)',
    acceptableShortReason: '△ABC ≡ △DEF (SSS / SAS / AAS / RHS)',
    grade: 9,
  },

  // --- Circles: Chords & Angles (Grade 11) ---
  {
    id: 'GEO-CC-01',
    category: 'circles_chords',
    fullTheorem: 'The line drawn from the centre of a circle perpendicular to a chord bisects the chord',
    acceptableShortReason: 'line from centre ⊥ chord',
    grade: 11,
  },
  {
    id: 'GEO-CC-02',
    category: 'circles_chords',
    fullTheorem: 'The line drawn from the centre of a circle to the midpoint of a chord is perpendicular to the chord',
    acceptableShortReason: 'line from centre to midpt of chord',
    grade: 11,
  },
  {
    id: 'GEO-CC-03',
    category: 'circles_chords',
    fullTheorem: 'The perpendicular bisector of a chord passes through the centre of the circle',
    acceptableShortReason: 'perp bisector of chord',
    grade: 11,
  },
  {
    id: 'GEO-CC-04',
    category: 'circles_chords',
    fullTheorem: 'The angle subtended by an arc at the centre is double the angle subtended by the same arc at the circumference',
    acceptableShortReason: '∠ at centre = 2∠ at circ',
    grade: 11,
  },
  {
    id: 'GEO-CC-05',
    category: 'circles_chords',
    fullTheorem: 'The angle subtended by a diameter at the circumference is a right angle (90°)',
    acceptableShortReason: '∠ in semi-circle',
    grade: 11,
  },
  {
    id: 'GEO-CC-06',
    category: 'circles_chords',
    fullTheorem: 'If a chord subtends a right angle at the circumference, the chord is a diameter',
    acceptableShortReason: 'chord subtends 90°',
    grade: 11,
  },
  {
    id: 'GEO-CC-07',
    category: 'circles_chords',
    fullTheorem: 'Angles subtended by a chord on the same side of the chord are equal',
    acceptableShortReason: '∠s in same seg',
    grade: 11,
  },
  {
    id: 'GEO-CC-08',
    category: 'circles_chords',
    fullTheorem: 'Equal chords subtend equal angles at the circumference',
    acceptableShortReason: 'equal chords; equal ∠s',
    grade: 11,
  },
  {
    id: 'GEO-CC-09',
    category: 'circles_chords',
    fullTheorem: 'Equal chords subtend equal angles at the centre of the circle',
    acceptableShortReason: 'equal chords; equal ∠s at centre',
    grade: 11,
  },

  // --- Circles: Cyclic Quadrilaterals (Grade 11) ---
  {
    id: 'GEO-CQ-01',
    category: 'circles_cyclic',
    fullTheorem: 'The opposite angles of a cyclic quadrilateral are supplementary (add up to 180°)',
    acceptableShortReason: 'opp ∠s of cyclic quad',
    grade: 11,
  },
  {
    id: 'GEO-CQ-02',
    category: 'circles_cyclic',
    fullTheorem: 'The exterior angle of a cyclic quadrilateral equals the interior opposite angle',
    acceptableShortReason: 'ext ∠ of cyclic quad',
    grade: 11,
  },
  {
    id: 'GEO-CQ-03',
    category: 'circles_cyclic',
    fullTheorem: 'If a line segment subtends equal angles at two points on the same side, the four points are concyclic',
    acceptableShortReason: 'line subtends equal ∠s',
    grade: 11,
  },
  {
    id: 'GEO-CQ-04',
    category: 'circles_cyclic',
    fullTheorem: 'If the opposite angles of a quadrilateral are supplementary, the quadrilateral is cyclic',
    acceptableShortReason: 'opp ∠s supp',
    grade: 11,
  },
  {
    id: 'GEO-CQ-05',
    category: 'circles_cyclic',
    fullTheorem: 'If the exterior angle of a quadrilateral equals the interior opposite angle, the quadrilateral is cyclic',
    acceptableShortReason: 'ext ∠ = int opp ∠',
    grade: 11,
  },

  // --- Circles: Tangents (Grade 11) ---
  {
    id: 'GEO-CT-01',
    category: 'circles_tangents',
    fullTheorem: 'A tangent to a circle is perpendicular to the radius at the point of contact',
    acceptableShortReason: 'tan ⊥ radius',
    grade: 11,
  },
  {
    id: 'GEO-CT-02',
    category: 'circles_tangents',
    fullTheorem: 'Two tangents drawn to a circle from the same external point are equal in length',
    acceptableShortReason: 'tans from same pt',
    grade: 11,
  },
  {
    id: 'GEO-CT-03',
    category: 'circles_tangents',
    fullTheorem: 'The angle between a tangent to a circle and a chord through the point of contact equals the angle in the alternate segment',
    acceptableShortReason: 'tan-chord thm',
    grade: 11,
  },
  {
    id: 'GEO-CT-04',
    category: 'circles_tangents',
    fullTheorem: 'If a line forms an angle with a chord equal to the angle in the alternate segment, the line is a tangent',
    acceptableShortReason: 'converse tan-chord thm',
    grade: 11,
  },
  {
    id: 'GEO-CT-05',
    category: 'circles_tangents',
    fullTheorem: 'If a line is perpendicular to a radius at its contact point on the circle, the line is a tangent',
    acceptableShortReason: 'converse tan ⊥ radius',
    grade: 11,
  },

  // --- Proportionality & Similarity (Grade 12) ---
  {
    id: 'GEO-PS-01',
    category: 'proportionality_similarity',
    fullTheorem: 'A line drawn parallel to one side of a triangle divides the other two sides proportionally',
    acceptableShortReason: 'line ∥ to one side of △',
    grade: 12,
  },
  {
    id: 'GEO-PS-02',
    category: 'proportionality_similarity',
    fullTheorem: 'If a line divides two sides of a triangle proportionally, the line is parallel to the third side',
    acceptableShortReason: 'converse prop thm',
    grade: 12,
  },
  {
    id: 'GEO-PS-03',
    category: 'proportionality_similarity',
    fullTheorem: 'The line joining the midpoints of two sides of a triangle is parallel to third side and half its length',
    acceptableShortReason: 'midpt Theorem',
    grade: 10,
  },
  {
    id: 'GEO-PS-04',
    category: 'proportionality_similarity',
    fullTheorem: 'The line drawn through the midpoint of one side parallel to another side bisects the third side',
    acceptableShortReason: 'converse midpt Theorem',
    grade: 10,
  },
  {
    id: 'GEO-PS-05',
    category: 'proportionality_similarity',
    fullTheorem: 'If two triangles are equiangular, their corresponding sides are in the same ratio (similar triangles)',
    acceptableShortReason: '||| △s',
    grade: 12,
  },
  {
    id: 'GEO-PS-06',
    category: 'proportionality_similarity',
    fullTheorem: 'If corresponding sides of two triangles are in the same ratio, the triangles are equiangular',
    acceptableShortReason: 'sides in prop',
    grade: 12,
  },
  {
    id: 'GEO-PS-07',
    category: 'proportionality_similarity',
    fullTheorem: 'The perpendicular from vertex of right angle to hypotenuse divides triangle into two similar triangles',
    acceptableShortReason: '△s with right ∠s',
    grade: 12,
  },
];

export function getAllGeometryReasons(): GeometryReason[] {
  return GEOMETRY_REASONS;
}

export function getGeometryReasonsByCategory(
  category: GeometryReason['category']
): GeometryReason[] {
  return GEOMETRY_REASONS.filter((r) => r.category === category);
}

export function getGeometryReasonById(id: string): GeometryReason | undefined {
  return GEOMETRY_REASONS.find((r) => r.id === id);
}
