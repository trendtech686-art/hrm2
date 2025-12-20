import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Input } from "../../../components/ui/input";

interface OrderNotesCardProps {
  notes?: string;
  tags?: string;
  onNotesChange: (notes: string) => void;
  onTagsChange: (tags: string) => void;
}

export function OrderNotesCard({
  notes,
  tags,
  onNotesChange,
  onTagsChange,
}: OrderNotesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Ghi chú đơn</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="notes">VD: Hàng cần gói riêng...</Label>
          <Textarea
            id="notes"
            placeholder="Nhập ghi chú đơn hàng"
            value={notes || ""}
            onChange={(e) => onNotesChange(e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            placeholder="Nhập ký tự và ấn enter"
            value={tags || ""}
            onChange={(e) => onTagsChange(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
