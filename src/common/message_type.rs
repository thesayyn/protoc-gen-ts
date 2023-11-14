use crate::{descriptor::{DescriptorProto, FieldDescriptorProto}, context::Context};

impl DescriptorProto {
    pub fn get_oneof_fields(&self, current: &FieldDescriptorProto) -> Vec<FieldDescriptorProto> {
        let mut fields = vec![];
        for field in self.field.clone() {
            if field.has_oneof_index()
                && field.oneof_index() == current.oneof_index()
                && field.number() != current.number()
            {
                fields.push(field)
            }
        }
        fields
    }

    pub fn is_well_known(&self, ctx: &Context) -> bool {
        let type_name = ctx.calculate_type_name(self.name());
        type_name.starts_with(".google.protobuf.")
    }
}
