// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.31.0
// 	protoc        v4.23.4
// source: weather.proto

package pb

import (
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	reflect "reflect"
	sync "sync"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

type City struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// See: https://en.wikipedia.org/wiki/ISO_3166-2
	Code string `protobuf:"bytes,1,opt,name=code,proto3" json:"code,omitempty"`
	Name string `protobuf:"bytes,2,opt,name=name,proto3" json:"name,omitempty"`
}

func (x *City) Reset() {
	*x = City{}
	if protoimpl.UnsafeEnabled {
		mi := &file_weather_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *City) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*City) ProtoMessage() {}

func (x *City) ProtoReflect() protoreflect.Message {
	mi := &file_weather_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use City.ProtoReflect.Descriptor instead.
func (*City) Descriptor() ([]byte, []int) {
	return file_weather_proto_rawDescGZIP(), []int{0}
}

func (x *City) GetCode() string {
	if x != nil {
		return x.Code
	}
	return ""
}

func (x *City) GetName() string {
	if x != nil {
		return x.Name
	}
	return ""
}

type Temperature struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// See: https://en.wikipedia.org/wiki/ISO_3166-2
	Code    string `protobuf:"bytes,1,opt,name=code,proto3" json:"code,omitempty"`
	Current int32  `protobuf:"varint,2,opt,name=current,proto3" json:"current,omitempty"`
}

func (x *Temperature) Reset() {
	*x = Temperature{}
	if protoimpl.UnsafeEnabled {
		mi := &file_weather_proto_msgTypes[1]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Temperature) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Temperature) ProtoMessage() {}

func (x *Temperature) ProtoReflect() protoreflect.Message {
	mi := &file_weather_proto_msgTypes[1]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Temperature.ProtoReflect.Descriptor instead.
func (*Temperature) Descriptor() ([]byte, []int) {
	return file_weather_proto_rawDescGZIP(), []int{1}
}

func (x *Temperature) GetCode() string {
	if x != nil {
		return x.Code
	}
	return ""
}

func (x *Temperature) GetCurrent() int32 {
	if x != nil {
		return x.Current
	}
	return 0
}

type CityQuery struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields
}

func (x *CityQuery) Reset() {
	*x = CityQuery{}
	if protoimpl.UnsafeEnabled {
		mi := &file_weather_proto_msgTypes[2]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *CityQuery) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*CityQuery) ProtoMessage() {}

func (x *CityQuery) ProtoReflect() protoreflect.Message {
	mi := &file_weather_proto_msgTypes[2]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use CityQuery.ProtoReflect.Descriptor instead.
func (*CityQuery) Descriptor() ([]byte, []int) {
	return file_weather_proto_rawDescGZIP(), []int{2}
}

type GetTemperature struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Code string `protobuf:"bytes,1,opt,name=code,proto3" json:"code,omitempty"`
}

func (x *GetTemperature) Reset() {
	*x = GetTemperature{}
	if protoimpl.UnsafeEnabled {
		mi := &file_weather_proto_msgTypes[3]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *GetTemperature) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetTemperature) ProtoMessage() {}

func (x *GetTemperature) ProtoReflect() protoreflect.Message {
	mi := &file_weather_proto_msgTypes[3]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetTemperature.ProtoReflect.Descriptor instead.
func (*GetTemperature) Descriptor() ([]byte, []int) {
	return file_weather_proto_rawDescGZIP(), []int{3}
}

func (x *GetTemperature) GetCode() string {
	if x != nil {
		return x.Code
	}
	return ""
}

type Ping struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields
}

func (x *Ping) Reset() {
	*x = Ping{}
	if protoimpl.UnsafeEnabled {
		mi := &file_weather_proto_msgTypes[4]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Ping) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Ping) ProtoMessage() {}

func (x *Ping) ProtoReflect() protoreflect.Message {
	mi := &file_weather_proto_msgTypes[4]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Ping.ProtoReflect.Descriptor instead.
func (*Ping) Descriptor() ([]byte, []int) {
	return file_weather_proto_rawDescGZIP(), []int{4}
}

type Forecast struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Code string `protobuf:"bytes,1,opt,name=code,proto3" json:"code,omitempty"`
	Date string `protobuf:"bytes,2,opt,name=date,proto3" json:"date,omitempty"`
}

func (x *Forecast) Reset() {
	*x = Forecast{}
	if protoimpl.UnsafeEnabled {
		mi := &file_weather_proto_msgTypes[5]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Forecast) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Forecast) ProtoMessage() {}

func (x *Forecast) ProtoReflect() protoreflect.Message {
	mi := &file_weather_proto_msgTypes[5]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Forecast.ProtoReflect.Descriptor instead.
func (*Forecast) Descriptor() ([]byte, []int) {
	return file_weather_proto_rawDescGZIP(), []int{5}
}

func (x *Forecast) GetCode() string {
	if x != nil {
		return x.Code
	}
	return ""
}

func (x *Forecast) GetDate() string {
	if x != nil {
		return x.Date
	}
	return ""
}

type CityQuery_Result struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Cities []*City `protobuf:"bytes,2,rep,name=cities,proto3" json:"cities,omitempty"`
}

func (x *CityQuery_Result) Reset() {
	*x = CityQuery_Result{}
	if protoimpl.UnsafeEnabled {
		mi := &file_weather_proto_msgTypes[6]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *CityQuery_Result) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*CityQuery_Result) ProtoMessage() {}

func (x *CityQuery_Result) ProtoReflect() protoreflect.Message {
	mi := &file_weather_proto_msgTypes[6]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use CityQuery_Result.ProtoReflect.Descriptor instead.
func (*CityQuery_Result) Descriptor() ([]byte, []int) {
	return file_weather_proto_rawDescGZIP(), []int{2, 0}
}

func (x *CityQuery_Result) GetCities() []*City {
	if x != nil {
		return x.Cities
	}
	return nil
}

type Ping_Ack struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields
}

func (x *Ping_Ack) Reset() {
	*x = Ping_Ack{}
	if protoimpl.UnsafeEnabled {
		mi := &file_weather_proto_msgTypes[7]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Ping_Ack) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Ping_Ack) ProtoMessage() {}

func (x *Ping_Ack) ProtoReflect() protoreflect.Message {
	mi := &file_weather_proto_msgTypes[7]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Ping_Ack.ProtoReflect.Descriptor instead.
func (*Ping_Ack) Descriptor() ([]byte, []int) {
	return file_weather_proto_rawDescGZIP(), []int{4, 0}
}

type Forecast_Result struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Temperature *Temperature `protobuf:"bytes,1,opt,name=temperature,proto3" json:"temperature,omitempty"`
}

func (x *Forecast_Result) Reset() {
	*x = Forecast_Result{}
	if protoimpl.UnsafeEnabled {
		mi := &file_weather_proto_msgTypes[8]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Forecast_Result) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Forecast_Result) ProtoMessage() {}

func (x *Forecast_Result) ProtoReflect() protoreflect.Message {
	mi := &file_weather_proto_msgTypes[8]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Forecast_Result.ProtoReflect.Descriptor instead.
func (*Forecast_Result) Descriptor() ([]byte, []int) {
	return file_weather_proto_rawDescGZIP(), []int{5, 0}
}

func (x *Forecast_Result) GetTemperature() *Temperature {
	if x != nil {
		return x.Temperature
	}
	return nil
}

var File_weather_proto protoreflect.FileDescriptor

var file_weather_proto_rawDesc = []byte{
	0x0a, 0x0d, 0x77, 0x65, 0x61, 0x74, 0x68, 0x65, 0x72, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x22,
	0x2e, 0x0a, 0x04, 0x43, 0x69, 0x74, 0x79, 0x12, 0x12, 0x0a, 0x04, 0x63, 0x6f, 0x64, 0x65, 0x18,
	0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x04, 0x63, 0x6f, 0x64, 0x65, 0x12, 0x12, 0x0a, 0x04, 0x6e,
	0x61, 0x6d, 0x65, 0x18, 0x02, 0x20, 0x01, 0x28, 0x09, 0x52, 0x04, 0x6e, 0x61, 0x6d, 0x65, 0x22,
	0x3b, 0x0a, 0x0b, 0x54, 0x65, 0x6d, 0x70, 0x65, 0x72, 0x61, 0x74, 0x75, 0x72, 0x65, 0x12, 0x12,
	0x0a, 0x04, 0x63, 0x6f, 0x64, 0x65, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x04, 0x63, 0x6f,
	0x64, 0x65, 0x12, 0x18, 0x0a, 0x07, 0x63, 0x75, 0x72, 0x72, 0x65, 0x6e, 0x74, 0x18, 0x02, 0x20,
	0x01, 0x28, 0x05, 0x52, 0x07, 0x63, 0x75, 0x72, 0x72, 0x65, 0x6e, 0x74, 0x22, 0x34, 0x0a, 0x09,
	0x43, 0x69, 0x74, 0x79, 0x51, 0x75, 0x65, 0x72, 0x79, 0x1a, 0x27, 0x0a, 0x06, 0x52, 0x65, 0x73,
	0x75, 0x6c, 0x74, 0x12, 0x1d, 0x0a, 0x06, 0x63, 0x69, 0x74, 0x69, 0x65, 0x73, 0x18, 0x02, 0x20,
	0x03, 0x28, 0x0b, 0x32, 0x05, 0x2e, 0x43, 0x69, 0x74, 0x79, 0x52, 0x06, 0x63, 0x69, 0x74, 0x69,
	0x65, 0x73, 0x22, 0x24, 0x0a, 0x0e, 0x47, 0x65, 0x74, 0x54, 0x65, 0x6d, 0x70, 0x65, 0x72, 0x61,
	0x74, 0x75, 0x72, 0x65, 0x12, 0x12, 0x0a, 0x04, 0x63, 0x6f, 0x64, 0x65, 0x18, 0x01, 0x20, 0x01,
	0x28, 0x09, 0x52, 0x04, 0x63, 0x6f, 0x64, 0x65, 0x22, 0x0d, 0x0a, 0x04, 0x50, 0x69, 0x6e, 0x67,
	0x1a, 0x05, 0x0a, 0x03, 0x41, 0x63, 0x6b, 0x22, 0x6c, 0x0a, 0x08, 0x46, 0x6f, 0x72, 0x65, 0x63,
	0x61, 0x73, 0x74, 0x12, 0x12, 0x0a, 0x04, 0x63, 0x6f, 0x64, 0x65, 0x18, 0x01, 0x20, 0x01, 0x28,
	0x09, 0x52, 0x04, 0x63, 0x6f, 0x64, 0x65, 0x12, 0x12, 0x0a, 0x04, 0x64, 0x61, 0x74, 0x65, 0x18,
	0x02, 0x20, 0x01, 0x28, 0x09, 0x52, 0x04, 0x64, 0x61, 0x74, 0x65, 0x1a, 0x38, 0x0a, 0x06, 0x52,
	0x65, 0x73, 0x75, 0x6c, 0x74, 0x12, 0x2e, 0x0a, 0x0b, 0x74, 0x65, 0x6d, 0x70, 0x65, 0x72, 0x61,
	0x74, 0x75, 0x72, 0x65, 0x18, 0x01, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x0c, 0x2e, 0x54, 0x65, 0x6d,
	0x70, 0x65, 0x72, 0x61, 0x74, 0x75, 0x72, 0x65, 0x52, 0x0b, 0x74, 0x65, 0x6d, 0x70, 0x65, 0x72,
	0x61, 0x74, 0x75, 0x72, 0x65, 0x32, 0xa3, 0x01, 0x0a, 0x07, 0x57, 0x65, 0x61, 0x74, 0x68, 0x65,
	0x72, 0x12, 0x27, 0x0a, 0x06, 0x63, 0x69, 0x74, 0x69, 0x65, 0x73, 0x12, 0x0a, 0x2e, 0x43, 0x69,
	0x74, 0x79, 0x51, 0x75, 0x65, 0x72, 0x79, 0x1a, 0x11, 0x2e, 0x43, 0x69, 0x74, 0x79, 0x51, 0x75,
	0x65, 0x72, 0x79, 0x2e, 0x52, 0x65, 0x73, 0x75, 0x6c, 0x74, 0x12, 0x26, 0x0a, 0x03, 0x67, 0x65,
	0x74, 0x12, 0x0f, 0x2e, 0x47, 0x65, 0x74, 0x54, 0x65, 0x6d, 0x70, 0x65, 0x72, 0x61, 0x74, 0x75,
	0x72, 0x65, 0x1a, 0x0c, 0x2e, 0x54, 0x65, 0x6d, 0x70, 0x65, 0x72, 0x61, 0x74, 0x75, 0x72, 0x65,
	0x30, 0x01, 0x12, 0x1a, 0x0a, 0x04, 0x70, 0x69, 0x6e, 0x67, 0x12, 0x05, 0x2e, 0x50, 0x69, 0x6e,
	0x67, 0x1a, 0x09, 0x2e, 0x50, 0x69, 0x6e, 0x67, 0x2e, 0x41, 0x63, 0x6b, 0x28, 0x01, 0x12, 0x2b,
	0x0a, 0x08, 0x66, 0x6f, 0x72, 0x65, 0x63, 0x61, 0x73, 0x74, 0x12, 0x09, 0x2e, 0x46, 0x6f, 0x72,
	0x65, 0x63, 0x61, 0x73, 0x74, 0x1a, 0x10, 0x2e, 0x46, 0x6f, 0x72, 0x65, 0x63, 0x61, 0x73, 0x74,
	0x2e, 0x52, 0x65, 0x73, 0x75, 0x6c, 0x74, 0x28, 0x01, 0x30, 0x01, 0x42, 0x0a, 0x5a, 0x08, 0x2e,
	0x2f, 0x73, 0x72, 0x76, 0x2f, 0x70, 0x62, 0x62, 0x06, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x33,
}

var (
	file_weather_proto_rawDescOnce sync.Once
	file_weather_proto_rawDescData = file_weather_proto_rawDesc
)

func file_weather_proto_rawDescGZIP() []byte {
	file_weather_proto_rawDescOnce.Do(func() {
		file_weather_proto_rawDescData = protoimpl.X.CompressGZIP(file_weather_proto_rawDescData)
	})
	return file_weather_proto_rawDescData
}

var file_weather_proto_msgTypes = make([]protoimpl.MessageInfo, 9)
var file_weather_proto_goTypes = []interface{}{
	(*City)(nil),             // 0: City
	(*Temperature)(nil),      // 1: Temperature
	(*CityQuery)(nil),        // 2: CityQuery
	(*GetTemperature)(nil),   // 3: GetTemperature
	(*Ping)(nil),             // 4: Ping
	(*Forecast)(nil),         // 5: Forecast
	(*CityQuery_Result)(nil), // 6: CityQuery.Result
	(*Ping_Ack)(nil),         // 7: Ping.Ack
	(*Forecast_Result)(nil),  // 8: Forecast.Result
}
var file_weather_proto_depIdxs = []int32{
	0, // 0: CityQuery.Result.cities:type_name -> City
	1, // 1: Forecast.Result.temperature:type_name -> Temperature
	2, // 2: Weather.cities:input_type -> CityQuery
	3, // 3: Weather.get:input_type -> GetTemperature
	4, // 4: Weather.ping:input_type -> Ping
	5, // 5: Weather.forecast:input_type -> Forecast
	6, // 6: Weather.cities:output_type -> CityQuery.Result
	1, // 7: Weather.get:output_type -> Temperature
	7, // 8: Weather.ping:output_type -> Ping.Ack
	8, // 9: Weather.forecast:output_type -> Forecast.Result
	6, // [6:10] is the sub-list for method output_type
	2, // [2:6] is the sub-list for method input_type
	2, // [2:2] is the sub-list for extension type_name
	2, // [2:2] is the sub-list for extension extendee
	0, // [0:2] is the sub-list for field type_name
}

func init() { file_weather_proto_init() }
func file_weather_proto_init() {
	if File_weather_proto != nil {
		return
	}
	if !protoimpl.UnsafeEnabled {
		file_weather_proto_msgTypes[0].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*City); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_weather_proto_msgTypes[1].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*Temperature); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_weather_proto_msgTypes[2].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*CityQuery); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_weather_proto_msgTypes[3].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*GetTemperature); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_weather_proto_msgTypes[4].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*Ping); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_weather_proto_msgTypes[5].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*Forecast); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_weather_proto_msgTypes[6].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*CityQuery_Result); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_weather_proto_msgTypes[7].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*Ping_Ack); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_weather_proto_msgTypes[8].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*Forecast_Result); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_weather_proto_rawDesc,
			NumEnums:      0,
			NumMessages:   9,
			NumExtensions: 0,
			NumServices:   1,
		},
		GoTypes:           file_weather_proto_goTypes,
		DependencyIndexes: file_weather_proto_depIdxs,
		MessageInfos:      file_weather_proto_msgTypes,
	}.Build()
	File_weather_proto = out.File
	file_weather_proto_rawDesc = nil
	file_weather_proto_goTypes = nil
	file_weather_proto_depIdxs = nil
}
