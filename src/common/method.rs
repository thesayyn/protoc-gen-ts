use crate::{descriptor::{MethodDescriptorProto, ServiceDescriptorProto}, context::Context};

impl MethodDescriptorProto {

    pub fn path(&self, ctx: &Context, svc: &ServiceDescriptorProto) -> String {
        let ns = ctx.get_namespace();

        let svcname = if ns.is_empty() {
            svc.name().to_string()
        } else {
            format!("{}.{}", ns, svc.name())
        };

        format!("/{}/{}", svcname, self.name())
    }


    pub fn is_unary(&self) -> bool {
        !self.client_streaming() && !self.server_streaming()
    }

    pub fn is_client_stream(&self) -> bool {
        self.client_streaming() && !self.server_streaming()
    }
    pub fn is_server_stream(&self) -> bool {
        !self.client_streaming() && self.server_streaming()
    }

    pub fn is_bidirectional(&self) -> bool {
        self.client_streaming() && self.server_streaming()
    }
}